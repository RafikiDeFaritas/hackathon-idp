const INVALID = { valide: false, etatAdministratif: 'N/A', nomEntreprise: '' };

export async function validateSIRET(siret) {
  if (!siret || siret.length !== 14) return INVALID;

  try {
    const res = await fetch(`https://recherche-entreprises.api.gouv.fr/search?q=${siret}&per_page=1`);
    const data = await res.json();
    //console.log(data);
    const company = data.results?.[0];
    if (!company) return INVALID;

    return {
      valide: true,
      etatAdministratif: company.siege?.etat_administratif || '',
      nomEntreprise: company.nom_complet || company.denomination || ''
    };
  } catch {
    return INVALID;
  }
}

validateSIRET('48250999900736').then(console.log);

