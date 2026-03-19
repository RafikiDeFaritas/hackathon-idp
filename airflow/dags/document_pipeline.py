from airflow import DAG
from airflow.operators.python import PythonOperator
from datetime import datetime
from minio import Minio
import requests
import os
import tempfile

MINIO_ENDPOINT = os.environ.get("MINIO_ENDPOINT", "minio")
MINIO_PORT = int(os.environ.get("MINIO_PORT", "9000"))
MINIO_ACCESS_KEY = os.environ.get("MINIO_ROOT_USER", "admin")
MINIO_SECRET_KEY = os.environ.get("MINIO_ROOT_PASSWORD", "password123")
MINIO_BUCKET = os.environ.get("MINIO_BUCKET", "document-datalake")
OCR_API_URL = os.environ.get("OCR_API_URL", "http://ocr-api:8000/extract")

client = Minio(
    f"{MINIO_ENDPOINT}:{MINIO_PORT}",
    access_key=MINIO_ACCESS_KEY,
    secret_key=MINIO_SECRET_KEY,
    secure=False,
)

def download_raw(**context):
    conf = context["dag_run"].conf or {}
    object_path = conf.get("objectPath")
    if not object_path:
        raise ValueError("objectPath must be passed in dag_run.conf")

    tmp_dir = tempfile.mkdtemp()
    local_file = os.path.join(tmp_dir, os.path.basename(object_path))
    client.fget_object(MINIO_BUCKET, object_path, local_file)
    # expose local path to next tasks
    context["ti"].xcom_push(key="local_file", value=local_file)
    context["ti"].xcom_push(key="object_path", value=object_path)
    return local_file


def perform_ocr(**context):
    local_file = context["ti"].xcom_pull(key="local_file")
    if not local_file:
        raise ValueError("local_file missing from xcom")

    with open(local_file, "rb") as f:
        files = {"file": (os.path.basename(local_file), f, "application/pdf")}
        resp = requests.post(OCR_API_URL, files=files, timeout=60)
    resp.raise_for_status()
    data = resp.json()
    # store the OCR result for upload
    context["ti"].xcom_push(key="ocr_result", value=data)
    return data


def upload_clean(**context):
    object_path = context["ti"].xcom_pull(key="object_path")
    data = context["ti"].xcom_pull(key="ocr_result")
    if not object_path or data is None:
        raise ValueError("Missing data for clean upload")

    cleaned_name = os.path.basename(object_path).rsplit(".", 1)[0] + ".txt"
    clean_object = f"clean/{cleaned_name}"
    content = ""

    if isinstance(data, dict):
        if "text" in data and isinstance(data["text"], str):
            content = data["text"]
        elif "extracted_data" in data:
            extracted = data["extracted_data"]
            content = extracted if isinstance(extracted, str) else str(extracted)
        else:
            content = str(data)
    else:
        content = str(data)

    client.put_object(
        MINIO_BUCKET,
        clean_object,
        data=content.encode("utf-8"),
        length=len(content.encode("utf-8")),
        content_type="text/plain",
    )
    return clean_object

with DAG(
    "document_pipeline",
    start_date=datetime(2024, 1, 1),
    schedule_interval=None,
    catchup=False,
    tags=["document"]
) as dag:

    download_task = PythonOperator(
        task_id="download_raw",
        python_callable=download_raw,
        provide_context=True,
    )

    ocr_task = PythonOperator(
        task_id="perform_ocr",
        python_callable=perform_ocr,
        provide_context=True,
    )

    upload_task = PythonOperator(
        task_id="upload_clean",
        python_callable=upload_clean,
        provide_context=True,
    )

    download_task >> ocr_task >> upload_task