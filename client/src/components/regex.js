//page contenant tous les regex utiliser

//Regex vérifiant si aucun caractère non désiré n'est saisi
export const BadCharac = new RegExp('([\$\{\}])');

//Regex vérifiant si le mot de passe contient bien toutes les informations requises
export const validPassword = new RegExp('^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[-+!*@%_])([-+!*@%_\w]{6,})$');

//Regex vérifiant si les inputs de saisi contiennent au moins 3 caractères
export const InputVide= new RegExp('([a-zA-Z]{3,})');
