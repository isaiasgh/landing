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
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`Error en la solicitud: ${response.statusText}`);
        }
        return response.json();
    })
    .then(result => {
        alert('Agradeciendo tu preferencia, nos mantenemos actualizados y enfocados en atenderte como mereces'); 
        form.reset()
        getData ();
    })
    .catch(error => {
        alert('Hemos experimentado un error. ¡Vuelve pronto!'); 
    });
}

let getData = async () => {
    try {
        const response = await fetch(databaseURL);

        if (!response.ok) {
            alert('Hemos experimentado un error. ¡Vuelve pronto!');
            return;
        }

        const data = await response.json();

        if (data != null) {
            let countSubs = new Map();
            let pilaMssj = [];
            let pilaNombres = [];
            let pilaCategorias = [];
            let categoryRatings = new Map();

            if (Object.keys(data).length > 0) {
                for (let key in data) {
                    let { email, message, name, product_type, rating, saved } = data[key];

                    if (message != undefined && message.length > 0) {
                        pilaNombres.push(name);
                        pilaMssj.push(message);
                        pilaCategorias.push(product_type);
                    }

                    let date = saved.split(",")[0];
                    let count = countSubs.get(date) || 0;
                    countSubs.set(date, count + 1);

                    if (product_type && rating) {
                        let categoryData = categoryRatings.get(product_type) || { sum: 0, count: 0 };
                        categoryData.sum += parseInt(rating);
                        categoryData.count += 1;
                        categoryRatings.set(product_type, categoryData);
                    }
                }
            }

            if (categoryRatings.size > 0) {
                const tableBody = document.querySelector('#subscribers');
                tableBody.innerHTML = '';

                for (let [category, data] of categoryRatings) {
                    let average = (data.sum / data.count).toFixed(1);
                    let rowTemplate = `
                        <tr>
                            <td>${category}</td>
                            <td>${average}</td>
                        </tr>`;
                    tableBody.innerHTML += rowTemplate;
                }
            }

            if (pilaMssj.length > 0) {
                if (window.swiper) {
                    window.swiper.destroy();
                }

                testimonios.innerHTML = '';

                for (let i = 0; i < 5; i++) {
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
        }
    } catch (error) {
        alert('Hemos experimentado un error. ¡Vuelve pronto!');
    }
};

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

function updateRatingValue(value) {
    document.getElementById('rating_value').textContent = value + '/5';
}

window.addEventListener("DOMContentLoaded", ready);
window.addEventListener("load", loaded)