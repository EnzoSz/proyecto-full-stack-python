document.querySelector(".contacto-form").addEventListener("submit", function(event){
    event.preventDefault(); // previene el envio por defecto del formulario
    //obtenemos los valores de los campos del formulario
    const formData = new FormData(document.querySelector(".contacto-form"));
    // Realizamos el envio utilizando fetch
    console.log(formData);
    fetch("https://enzosoliz.pythonanywhere.com/mensajes", {
        method: "POST",
        body: formData
    })
    .then(response => {
        if (response.ok) {
            //ocultamos el formulario
            document.querySelector(".contacto-form").style.display = "none";
            //mostramos el mensaje de datos enviados
            document.querySelector(".mensaje-enviado").style.display = "block";
            // reiniciamos el formulario despues de 2 segundos
            setTimeout(function(){
                document.querySelector(".contacto-form").style.display = "none";
                // document.getElementById("contacto-form").style.display = "block";
                document.querySelector(".mensaje-enviado").style.display = "none";
                document.querySelector(".contacto-form").reset();
            }, 2000);
        } else {
            throw new Error("Error al enviar los datos");
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
});