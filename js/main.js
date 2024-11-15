const databaseURL = 'https://landing-74463-default-rtdb.firebaseio.com/collection.json';

let ready = () => {
    console.log('DOM está listo')
    getData ();
}

let sendData = () => {
    const form = document.getElementById ("form");
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    data['saved'] = new Date().toLocaleString('es-CO', { timeZone: 'America/Guayaquil' })

    fetch(databaseURL, {
        method: 'POST', // Método de la solicitud
        headers: {
            'Content-Type': 'application/json' // Especifica que los datos están en formato JSON
        },
        body: JSON.stringify(data) // Convierte los datos a JSON
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`Error en la solicitud: ${response.statusText}`);
        }
        return response.json(); // Procesa la respuesta como JSON
    })
    .then(result => {
        alert('Agradeciendo tu preferencia, nos mantenemos actualizados y enfocados en atenderte como mereces'); // Maneja la respuesta con un mensaje
        form.reset()
        getData ();
    })
    .catch(error => {
        alert('Hemos experimentado un error. ¡Vuelve pronto!'); // Maneja el error con un mensaje
    });
}

let getData = async () => {
    try {
        // Realiza la petición fetch a la URL de la base de datos
        const response = await fetch(databaseURL);

        // Verifica si la respuesta es exitosa
        if (!response.ok) {
          alert('Hemos experimentado un error. ¡Vuelve pronto!'); // Maneja el error con un mensaje
        }

        // Convierte la respuesta en formato JSON
        const data = await response.json();

        if(data != null) {

            // Cuente el número de suscriptores registrados por fecha a partir del objeto data
            let countSubs = new Map();
            let pilaMssj = [];
            let pilaNombres = [];
            let pilaCategorias = [];

            if (Object.keys(data).length > 0) {
                for (let key in data) {

                    let { email, message, name, product_type, saved } = data[key]
                    
                    if (message != undefined) {
                        if (message.length > 0) {
                            pilaNombres.push (name);
                            pilaMssj.push (message);
                            pilaCategorias.push (product_type);
                        }
                    }
                    
                    let date = saved.split(",")[0]
                       
                    let count = countSubs.get(date) || 0;
                    countSubs.set(date, count + 1)
                }
            }



            // END

            // Genere y agregue filas de una tabla HTML para mostrar fechas y cantidades de suscriptores almacenadas 

            if (countSubs.size > 0) {
                subscribers.innerHTML = ''

                for (let [date, count] of countSubs) {
                    let rowTemplate = `
                        <tr>
                            <th scope="row">1</th>
                            <td>${date}</td>
                            <td>${count}</td>
                        </tr>`
                    subscribers.innerHTML += rowTemplate
                }
            }

            if (pilaMssj.length > 0) {

                if (window.swiper) {
                    window.swiper.destroy();
                }

                testimonios.innerHTML = '';

                for (let i = 0; i < pilaMssj.length; i++) {
                    let name = pilaNombres.pop();
                    let msj = pilaMssj.pop();

                    let activeClass = i === 0 ? 'active' : '';

                    let template = `
                        <div class="carousel-item ${activeClass}">
                            <div class="testimonial-item text-center">
                                <blockquote>
                                    <p>“${msj}”</p>
                                    <div class="review-title text-uppercase">${name}</div>
                                </blockquote>
                            </div>
                        </div>`;

                    testimonios.innerHTML += template;
                }

            }

            // END
        }

      } catch (error) {
        // Muestra cualquier error que ocurra durante la petición
        alert('Hemos experimentado un error. ¡Vuelve pronto!'); // Maneja el error con un mensaje
    }
}


let loaded = () => {
    let myForm = document.getElementById("form");
    myForm.addEventListener("submit", (eventSubmit) => {
        eventSubmit.preventDefault(); 
        
        const emailElement = document.querySelector('.form-control-lg');
        const emailText = emailElement.value;

        if (emailText.length === 0) {
            emailElement.focus()
            
            emailElement.animate(
                [
                    { transform: "translateX(0)" },
                    { transform: "translateX(50px)" },
                    { transform: "translateX(-50px)" },
                    { transform: "translateX(0)" }
                ],
                {
                    duration: 400,
                    easing: "linear",
                }
            )

            return;
        }

        sendData();
   
   })
}

window.addEventListener("DOMContentLoaded", ready);
window.addEventListener("load", loaded)