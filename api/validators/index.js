const { check } = require('express-validator');
const store = require('../../store/remote-mysql');
const storeMariaDb = require('../../mariadb/remote-mariadb')
let userValidation = [
    check('cedula').custom((cedula) => {
        return new Promise((resolve, reject) => {
            if (cedula.length == 10) {
                var digito_region = cedula.substring(0, 2);
                if (digito_region >= 1 && digito_region <= 24) {
                    var ultimo_digito = cedula.substring(9, 10);

                    var pares = parseInt(cedula.substring(1, 2)) + parseInt(cedula.substring(3, 4)) + parseInt(cedula.substring(5, 6)) + parseInt(cedula.substring(7, 8));

                    var numero1 = cedula.substring(0, 1);
                    var numero1 = (numero1 * 2);
                    if (numero1 > 9) { var numero1 = (numero1 - 9); }

                    var numero3 = cedula.substring(2, 3);
                    var numero3 = (numero3 * 2);
                    if (numero3 > 9) { var numero3 = (numero3 - 9); }

                    var numero5 = cedula.substring(4, 5);
                    var numero5 = (numero5 * 2);
                    if (numero5 > 9) { var numero5 = (numero5 - 9); }

                    var numero7 = cedula.substring(6, 7);
                    var numero7 = (numero7 * 2);
                    if (numero7 > 9) { var numero7 = (numero7 - 9); }

                    var numero9 = cedula.substring(8, 9);
                    var numero9 = (numero9 * 2);
                    if (numero9 > 9) { var numero9 = (numero9 - 9); }

                    var impares = numero1 + numero3 + numero5 + numero7 + numero9;

                    var suma_total = (pares + impares);

                    var primer_digito_suma = String(suma_total).substring(0, 1);

                    var decena = (parseInt(primer_digito_suma) + 1) * 10;

                    var digito_validador = decena - suma_total;

                    if (digito_validador == 10)
                        var digito_validador = 0;

                    if (digito_validador == ultimo_digito) {
                        store.query('user', { cedula }).then((data) => {
                            console.log(data, cedula)
                            if (data)
                                reject('Usuario ya existe')
                            else
                                resolve(true)
                        })
                    } else {
                        reject('la cedula:' + cedula + ' es incorrecta')
                    }

                } else {
                    reject('Esta cedula no pertenece a ninguna region')
                }
            } else {
                reject('Esta cedula debe contener 10 Digitos')
            }
        })
    }),
    check("contraseña").isLength({ min: 8 }).withMessage("La contraseña debe tener 8 caracteres o mas"),
    check("correo").isEmail().withMessage("El email no es valido").normalizeEmail(),
    check("cedula").custom((value, { req }) => {
        return new Promise((resolve, reject) => {
            storeMariaDb.selector('Patients', { select: `SELECT TOP 10 * FROM patients INNER JOIN patientbmi ON patients.PatientID = patientbmi.PatientID WHERE CedulaIdentidad = '${value}'` })
                .then((patient) => {
                    if (patient.recordset.length > 0) {
                        resolve(true)
                    }
                    else {
                        reject('Este cedula no esta registrada en bmi')
                    }
                }).catch((err) => reject('Error'))
        })
    })
];

let identificationValidator = (cedula) => {
    console.log(cedula.length)
}
module.exports = {
    userValidation
}