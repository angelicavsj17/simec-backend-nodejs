module.exports = {
    Pedidos: ((id, date, soapID) => {
        return `
        SELECT 
        AspNetUsers.PrinterHeader, AspNetUsers.PrinterFooter,
        AspNetUsers.HeaderLogo, AspNetUsers.FooterLogo,
        Patients.FirstName, Patients.LastName,
        Patients.CedulaIdentidad, Pedidos.PedidoID, Pedidos.DetalleOtros, 
        TipoPedido.Nombre, Cie10.Descriptor, Pedidos.DetalleTipoOtros,
        Pedidos.Observaciones
        FROM Pedidos
        INNER JOIN Patients ON Pedidos.PatientID = Patients.PatientID
        INNER JOIN soap ON SOAP.PatientID = Patients.PatientID
		INNER JOIN SoapsCieCodes ON SoapsCieCodes.SoapID = soap.SoapID
        INNER JOIN cie10 ON Cie10.CieID = SoapsCieCodes.CieID
        INNER JOIN AspNetUsers on AspNetUsers.Id = soap.CreadoPor
        INNER JOIN TipoPedido ON TipoPedido.TipoPedidoID = Pedidos.TipoPedidoID
        INNER JOIN DetallePedido ON DetallePedido.PedidoID = Pedidos.PedidoID 
        WHERE dateadd(dd,0, datediff(dd,0, Pedidos.FechaPedido)) = '${date}' 
        AND Patients.CedulaIdentidad = '${id}'
        AND soap.soapID = ${soapID}`
    }),
    DetallesPedido: ((id) => {
        return `SELECT * FROM DetallePedido 
        INNER JOIN ProductoAct ON DetallePedido.ProductoID = ProductoAct.ProductoID  
        WHERE DetallePedido.PedidoID =${id}`
    }),
    PedidosById: ((cedula, id) => {
        return `
        SELECT 
        AspNetUsers.PrinterHeader, AspNetUsers.PrinterFooter,
        AspNetUsers.HeaderLogo, AspNetUsers.FooterLogo,
        Patients.FirstName, Patients.LastName,
        Patients.CedulaIdentidad, Pedidos.PedidoID, Pedidos.DetalleOtros, 
        TipoPedido.Nombre, Cie10.Descriptor, Pedidos.DetalleTipoOtros,
        Pedidos.Observaciones, AspNetUsers.FirmaDigital
        FROM Pedidos
        INNER JOIN Patients ON Pedidos.PatientID = Patients.PatientID
        INNER JOIN soap ON SOAP.PatientID = Patients.PatientID
		INNER JOIN SoapsCieCodes ON SoapsCieCodes.SoapID = soap.SoapID
        INNER JOIN cie10 ON Cie10.CieID = SoapsCieCodes.CieID
        INNER JOIN AspNetUsers on AspNetUsers.Id = soap.CreadoPor
        INNER JOIN TipoPedido ON TipoPedido.TipoPedidoID = Pedidos.TipoPedidoID
        INNER JOIN DetallePedido ON DetallePedido.PedidoID = Pedidos.PedidoID 
        WHERE Patients.CedulaIdentidad = '${cedula}'
        AND Pedidos.PedidoID  = ${id}`
    }),
    Recetas: ((id, date, soapID) => {
        return `SELECT Patients.FirstName, Patients.LastName,
        Patients.CedulaIdentidad,AspNetUsers.PrinterHeader,
        AspNetUsers.HeaderLogo, AspNetUsers.FooterLogo,
        Prescriptions.Ciudad,Prescriptions.PrescriptionAlergias,
        Prescriptions.Diagnostico, Prescriptions.PrescriptionID,
        AspNetUsers.PrinterFooter, AspNetUsers.FirmaDigital
        FROM Prescriptions 
        INNER JOIN soap ON soap.PatientID = Prescriptions.PatientID
        INNER JOIN Patients ON Prescriptions.PatientID = Patients.PatientID
        INNER JOIN AspNetUsers ON AspNetUsers.Id = soap.CreadoPor 
        WHERE dateadd(dd,0, datediff(dd,0, Prescriptions.PrescriptionDate)) = '${date}' 
        AND Patients.CedulaIdentidad = '${id}'
        AND soap.soapID = ${soapID}`
    }),
    DetallesReceta: ((id) => {
        return `SELECT * FROM DetalleRecetas
        WHERE DetalleRecetas.PrescriptionID = ${id}`
    }),
    RecetasById: ((cedula, id) => {
        return `SELECT Patients.FirstName, Patients.LastName,
        Patients.CedulaIdentidad,AspNetUsers.PrinterHeader,
        AspNetUsers.HeaderLogo, AspNetUsers.FooterLogo,
        Prescriptions.Ciudad,Prescriptions.PrescriptionAlergias,
        Prescriptions.Diagnostico, Prescriptions.PrescriptionID,
        AspNetUsers.PrinterFooter, AspNetUsers.FirmaDigital
        FROM Prescriptions 
        INNER JOIN soap ON soap.PatientID = Prescriptions.PatientID
        INNER JOIN Patients ON Prescriptions.PatientID = Patients.PatientID
        INNER JOIN AspNetUsers ON AspNetUsers.Id = soap.CreadoPor 
   	    WHERE Patients.CedulaIdentidad = '${cedula}'
   	    AND Prescriptions.PrescriptionID = ${id}`
    }),
    Certificado: ((id, date, soapID) => {
        return `SELECT * from patients
        INNER JOIN Certificados ON Certificados.PatientID = Certificados.PatientID
        INNER JOIN soap ON soap.PatientID = Certificados.PatientID
        INNER JOIN AspNetUsers ON Certificados.CreadoPor = AspNetUsers.Id 
        WHERE dateadd(dd,0, datediff(dd,0, Certificados.Fecha)) = '${date}'
        AND Patients.CedulaIdentidad = '${id}'
        AND soap.soapID = ${soapID}`
    })
}