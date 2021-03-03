module.exports = {
    pedido: (soap, products) => {
        let data = {
            FirmaDigital: true,
            Telemedicina: soap.FirmaDigital && new Buffer(soap.FirmaDigital.data).toString('base64'),
            PrinterHeader: soap.PrinterHeader,
            PrinterFooter: soap.PrinterFooter,
            HeaderLogo: soap.HeaderLogo && new Buffer(soap.HeaderLogo.data).toString('base64'),
            FooterLogo: soap.HeaderLogo && new Buffer(soap.FooterLogo.data).toString('base64'),
            PatientName: soap.FirstName + soap.LastName,
            CedulaIdentidad: soap.CedulaIdentidad,
            Paciente: {
                CedulaIdentidad: soap.CedulaIdentidad,
            },
            Pedido: {
                DetallesPedido: (() => {
                    return products.map((producto) => {
                        return {
                            Producto: producto.NombreProducto
                        }
                    })
                })(),
                DetalleOtros: soap.DetalleOtros,
                TipodePedido: soap.Nombre,
                Diagnostico: soap.Descriptor,
                DetalleTipoOtros: soap.DetalleTipoOtros,
                Observaciones: soap.Observaciones,
            },
        }
        return data
    },
    recetas: (Prescriptions, DetalleReceta) => {
        var event = new Date();
        var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        let data = {
            PrinterHeader: Prescriptions.PrinterHeader,
            PrinterFooter: Prescriptions.PrinterFooter,
            FirmaDigital: true,
            Telemedicina: Prescriptions.FirmaDigital && new Buffer(Prescriptions.FirmaDigital.data).toString('base64'),
            HeaderLogo: Prescriptions.HeaderLogo && new Buffer(Prescriptions.HeaderLogo.data).toString('base64'),
            FooterLogo: Prescriptions.FooterLogo && new Buffer(Prescriptions.FooterLogo.data).toString('base64'),
            PatientName: Prescriptions.FirstName + ' ' + Prescriptions.LastName,
            CedulaIdentidad: Prescriptions.CedulaIdentidad,
            // fechaImpre: event.toLocaleDateString('es-ES', options),
            fechaImpre: event.toLocaleDateString(),
            PatientID: Prescriptions.CedulaIdentidad,
            PatientPrescripciones: (() => {
                return DetalleReceta.map((detalle, index) => {
                    return {
                        Receta_: (`${index + 1}.`) +
                            detalle.Generico +
                            ` (${detalle.Comercial}) ` +
                            ` ${detalle.ConcentracionActivos},  # ${detalle.Cantidad} \n`

                    }
                })
            })(),
            PatientIndicaciones: (() => {
                return DetalleReceta.map((detalle, index) => {
                    return {
                        Receta_: (`${index + 1}.`) +
                            detalle.Generico +
                            ` (${detalle.Comercial}) ` +
                            ` ${detalle.ConcentracionActivos}, ${detalle.Posologia} `

                    }
                })
            })(),
            Receta: {
                Ciudad: Prescriptions.Ciudad,
                PrescriptionAlergias: Prescriptions.PrescriptionAlergias,
                Diagnostico: Prescriptions.Diagnostico,
            },
        }
        return data
    },
    certificados: ((certs) => {
        let data = {
            FechaAtencion: (() => {
                let date = new Date(certs.CertificadoDate)
                return (
                    (date.getDate() < 10 ? "0" + date.getDate() : date.getDate()) + "/" +
                    (date.getMonth() < 10 ? "0" + date.getMonth() : date.getMonth()) + "/" +
                    date.getFullYear()
                )
            })(),
            ReposoDesde: (() => {
                let date = new Date(certs.ReposoDesde)
                return (
                    (date.getDate() < 10 ? "0" + date.getDate() : date.getDate()) + "/" +
                    (date.getMonth() < 10 ? "0" + date.getMonth() : date.getMonth()) + "/" +
                    date.getFullYear()
                )
            })(),
            ReposoHasta: (() => {
                let date = new Date(certs.ReposoHasta)
                return (
                    (date.getDate() < 10 ? "0" + date.getDate() : date.getDate()) + "/" +
                    (date.getMonth() < 10 ? "0" + date.getMonth() : date.getMonth()) + "/" +
                    date.getFullYear()
                )
            })(),
            Reposo: certs.ReposoDesde ? certs.ReposoHasta ? true : false : false,
            CertificadoCiudad: certs.Ciudad,
            PrinterHeader: certs.PrinterHeader,
            PrinterFooter: certs.PrinterFooter,
            HeaderLogo: certs.HeaderLogo && new Buffer(certs.HeaderLogo.data).toString('base64'),
            FooterLogo: certs.FooterLogo && new Buffer(certs.FooterLogo.data).toString('base64'),
        }
        return data
    })
}