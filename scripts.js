document.addEventListener("DOMContentLoaded", function(){
    const menuMobileIcon = document.querySelector('.mobile-menu-icon');
    const menu = document.querySelector('.menu');

    menuMobileIcon.addEventListener("click", function(){
        menu.classList.toggle('mobile-menu-open')
    })
})

// Filtragem dos produtos

document.addEventListener('DOMContentLoaded', function(){
    const sections = document.querySelectorAll('.products-infocenter');

    sections.forEach(section =>{
        const menuItems = section.querySelectorAll('.product-filter-brands ul li');
        const productCards = section.querySelectorAll('.card-new-products');

        const state = {
            activeBrand: "todos",
            activeType: "todos"
        }

        function updateCards(){
            productCards.forEach(card => {
                const brand = card.getAttribute('data-brand');
                const type = card.getAttribute('data-products-type');

                if((state.activeBrand === 'todos' || state.activeBrand === brand) && (state.activeType === "todos" || state.activeType === type)){
                    card.style.display = "block";
                } else {
                    card.style.display = "none";
                }
            })
        }

        menuItems.forEach(item => {
            item.addEventListener("click", () => {
                menuItems.forEach(menuItem => {
                    menuItem.classList.remove('product-brand-active');
                })

                item.classList.add('product-brand-active');

                state.activeBrand = item.getAttribute('data-brand');
                state.activeType = item.getAttribute('data-products-type');

                updateCards();
            })
        })
        updateCards();

    })
})

// Slider de patrocinadores

window.addEventListener('DOMContentLoaded', () => {
    const slider = document.querySelector('.slider-sponsors');

    if(slider){
        const images = slider.querySelectorAll('img');
        images.forEach(image => {
            const clone = image.cloneNode(true);
            slider.appendChild(clone);
        });
        
        const totalWidth = images.length * (images[0].offsetWidth + 20);
        
        slider.style.width = `${totalWidth}px`;
        
        let currentPosition = 0;

        const moveSlider = () => {
            currentPosition -= 1;
            if(currentPosition <= -totalWidth/2){
                currentPosition = 0;
            }

            slider.style.transform = `translateX(${currentPosition}px)`;
            requestAnimationFrame(moveSlider);
        }

        requestAnimationFrame(moveSlider);
        }

})

// Slider dos depoimentos

window.addEventListener('DOMContentLoaded', () => {
    const testimonial = document.querySelectorAll('.testimonial');
    
    if(testimonial.length > 0 ){
        const controls = document.querySelectorAll('.controls-testimonial span');
        const firstTestimonial = testimonial[0];
        const firstControl = controls[0];
        
        testimonial.forEach(testimonial => testimonial.style.display = 'none');
        firstTestimonial.style.display = 'block';
        
        controls.forEach(control => {
            control.addEventListener("click", () => {
                const targetSlide = control.getAttribute('data-slide');
                controls.forEach(c => c.classList.remove('active-testimonial'));
                control.classList.add('active-testimonial');

                testimonial.forEach(testimonial => testimonial.style.display = 'none');
                
                const testimonialShow = document.querySelector(`.testimonial[data-slide="${targetSlide}"]`);
                
                testimonialShow.style.display = "block"
            })
        })
        
        firstControl.classList.add("active-testimonial");
    }
    
})

// Manipulação carrinho

const productArray = [];
const neighborhoodShipment = [
    {
        neighborhood: 'Botafogo',
        shipment: 100
    },
    {
        neighborhood: 'Centro',
        shipment: 180,
    },
    {
        neighborhood: 'Copacabana',
        shipment: 150,
    }
];

let dataCartIsEmpty = true;

function increaseQuantity(event) {
    const quantityElements = event.target.parentElement.querySelector('.number-quantity');
    const quantity = parseInt(quantityElements.textContent);
    quantityElements.textContent = quantity + 1;
}

function decreaseQuantity(event) {
    const quantityElements = event.target.parentElement.querySelector('.number-quantity');
    const quantity = parseInt(quantityElements.textContent);

    if(quantity > 0) {
        quantityElements.textContent = quantity - 1;
    }
}

function updateCart(quantityProducts){
    const cart = document.querySelector('.items-cart');
    cart.textContent = quantityProducts;
}

function addProductToCart(event) {
    const productCard = event.target.closest('.card-new-products');
    const productName = productCard.querySelector('.info-products h3').textContent;
    const priceText = productCard.querySelector('.new-price').textContent;
    const productImg = productCard.querySelector(".img-product");
    const srcProduct = productImg.getAttribute("src");
    const price = parseFloat(priceText.replace("R$", ""));

    const quantityElements = productCard.querySelector('.number-quantity');

    let quantity = parseInt(quantityElements.textContent);

    const existingProductIndex = productArray.findIndex((product) => product.productName === productName);

    if(quantity > 0) {
        if(existingProductIndex !== -1){
            productArray[existingProductIndex].quantity = quantity;
        }else{
            productArray.push({
                productName: productName,
                price: price,
                productImg: srcProduct,
                quantity: quantity
            })
        }
    }else {
        if(existingProductIndex !== -1){
            productArray.splice(existingProductIndex, 1);
        }

    }

    localStorage.setItem("productsArray", JSON.stringify(productArray));

    updateCart(productArray ? productArray.length : 0);
}


const increaseButtons = document.querySelectorAll('.increase-quantity');
const decreaseButtons = document.querySelectorAll('.decrease-quantity');
const addCartButtons = document.querySelectorAll(".confirm-add-cart");

increaseButtons.forEach(buttton => {
    buttton.addEventListener("click", increaseQuantity);
})

decreaseButtons.forEach(buttton => {
    buttton.addEventListener("click", decreaseQuantity);
})

addCartButtons.forEach(button => {
    button.addEventListener("click", addProductToCart);
})

// Carrinho

const inputCep = document.querySelector("#cep");
const inputStreet = document.querySelector("#street");
const inputCity = document.querySelector("#city");
const inputState = document.querySelector("#state");
const inputNeighborhood = document.querySelector("#neighborhood");
const inputNumber = document.querySelector("#number");
const savedProductsArray = JSON.parse(localStorage.getItem("productsArray"));
const totalOrder = savedProductsArray ? savedProductsArray.reduce((accumulator, currentProduct) => {
    return accumulator + currentProduct.quantity * currentProduct.price;
}, 0) : 0;

const subtotal = document.querySelector("#subtotal-value");
const shipmentInput = document.querySelector("#shipment-value");
const totalOrderField = document.querySelector("#total-order-value");

window.addEventListener("DOMContentLoaded", function(){
    updateCart(savedProductsArray ? savedProductsArray.length : 0);
})

function searchCEP() {
    const typedCep = inputCep.value.trim().replace(/\D/g, "");

    fetch(`https://viacep.com.br/ws/${typedCep}/json/`).then((response)=>{
        if(!response.ok){
            console.error("Não foi possível obter os dados do CEP")
        }
        return response.json();
    }).then((data) => {
        inputCity.value = data.localidade;
        inputState.value = data.uf;
        if(data.bairro){
            inputNeighborhood.value = data.bairro;
            let changeEvent = new Event("change", {bubbles: true});
            inputNeighborhood.dispatchEvent(changeEvent);
        }
        inputStreet.value = data.logradouro;
    }).catch((error) => {
        console.error('Erro:', error)
    })
}

window.addEventListener("DOMContentLoaded", function() {
    const tbody = document.querySelector(".info-products-order tbody");
    
    if(tbody && savedProductsArray){
        for(const product of savedProductsArray){
            const row = document.createElement("tr");
            const nameCell = document.createElement("td");
                nameCell.innerHTML = `<div class="product-cart">
                                    <img src="${product.productImg}" alt="${product.productName}" width="100px"/>
                                    ${product.productName}
                                    </div>`;
                    
        const priceCell = document.createElement("td");
        priceCell.textContent = `R$ ${product.price.toFixed(2)}`;
        
        const quantityCell = document.createElement("td");
        quantityCell.textContent = product.quantity;

        const subtotalCell = document.createElement("td");
        const subtotal = product.price * product.quantity;
        subtotalCell.textContent = `R$${subtotal.toFixed(2)}`;

        row.appendChild(nameCell);
        row.appendChild(priceCell);
        row.appendChild(quantityCell);
        row.appendChild(subtotalCell);
        tbody.appendChild(row);
    }
}
const sectionProductMobile = document.querySelector(".info-products-order-mobile");

if(sectionProductMobile && savedProductsArray){
    for(const product of savedProductsArray){
        const ul = document.createElement("ul");
        const nameProduct = document.createElement("li");
        nameProduct.innerHTML = `item: <span>${product.productName}  <img src="${product.productImg}" alt="${product.productName}" width="100px"/></span>`

        const priceProduct = document.createElement("li");
        priceProduct.innerHTML = `Preço: <span>R$ ${product.price.toFixed(2)}</span>`;

        const quantityProduct = document.createElement("li");
        quantityProduct.innerHTML = `Qtde: <span>${product.quantity}</span>`;

        const subtotalProduct = document.createElement("li");
        const subtotalP = product.price * product.quantity;
        subtotalProduct.innerHTML = `Subtotal: <span>R$ ${subtotalP.toFixed(2)}</span>`;

        ul.appendChild(nameProduct);
        ul.appendChild(priceProduct);
        ul.appendChild(quantityProduct);
        ul.appendChild(subtotalProduct);
        sectionProductMobile.appendChild(ul);
    }
}

})

function finishOrder(){
    const fullName = document.querySelector("#fullName").value;
    const rg = document.querySelector("#rg").value;
    const cpf = document.querySelector("#cpf").value;

    const cep = inputCep.value;
    const street = inputStreet.value;
    const city = inputCity.value;
    const state = inputState.value;
    const neighborhood = inputNeighborhood.value;
    const number = inputNumber.value;

    let textFormatted = `Olá, gostaria de fazer um pedido!
    Meus dados são:
    Name: ${fullName}
    RG: ${rg}
    CPF: ${cpf}
    Endereço: Rua: ${street}, ${number}, Bairro: ${neighborhood}, Cidade: ${city}, Estado: ${state}, CEP: ${cep}
    Os produtos selecionados são:`;

    savedProductsArray.forEach((product) => {
        textFormatted += `
        Nome do produto: ${product.productName},
        Preço: R$ ${product.price},
        Quantidade: ${product.quantity}
        `;
    });

    textFormatted += `Total do pedido: R$ ${totalOrder}`

    const textEncoded = encodeURIComponent(textFormatted);

    window.open(`https://wa.me/5521965368629?text=${textEncoded}`);
}

function resetCart(){
    localStorage.removeItem("productsArray");
    inputCep.value = "";
    inputStreet.value = "";
    inputCity.value = "";
    inputState.value = "";
    inputNeighborhood.value = "";
    inputNumber.value = "";
    dataCartIsEmpty = true;
    location.reload();
}


function updateInfosOrder(discount){
    if(subtotal){
        subtotal.textContent = totalOrder - discount;
    }

    if(shipmentInput && totalOrderField && savedProductsArray.length > 0 && inputNeighborhood.value !== ""){
        const foundNeighborhood = neighborhoodShipment.find(info => info.neighborhood === inputNeighborhood.value);

        const shipmentValue = foundNeighborhood ? foundNeighborhood.shipment : 150;
        shipmentInput.textContent = shipmentValue;
        
        totalOrderField.textContent = Number(subtotal.textContent) + Number(shipmentValue);
    }
}

if(inputNeighborhood){
    inputNeighborhood.addEventListener("change", function(){
        dataCartIsEmpty = false;
        updateInfosOrder(0);
        updateButtonSendOrder();
    })
}

const availableCoupons = [
    {
        value: 'FREE10',
        discount: 10
    },
    {
        value: 'FREE20',
        discount: 20
    }
];

function addCoupon(){
    const inputCoupon = document.querySelector("#discount");
    const validCoupon = availableCoupons.find((coupon) => coupon.value === inputCoupon.value);
    const textCoupon = document.querySelector(".coupon-added span");
    const errrorCoupon = document.querySelector(".coupon-error");
    errrorCoupon.style.display = "none";

    if(validCoupon){
        textCoupon.textContent = validCoupon.value;
        updateInfosOrder(validCoupon.discount);
    }else {
        errrorCoupon.style.display = "block";
    }
}

function updateButtonSendOrder (){
    const input = document.querySelector("#send-order");
    if(input  && !dataCartIsEmpty){
        input.classList.remove("disabled-send-order");
    }else {
        input.classList.add("disable-send-order");
    }
}

// Rolagem da página
function scrollToSection(sectionId) {
    const section = document.querySelector(sectionId);

    if(section) {
        let scrollOffset = 0;

        scrollOffset = section.offsetTop - (window.innerHeight - section.clientHeight) / 2;

        window.scrollTo({
            top: scrollOffset,
            behavior: 'smooth'
        })
    }
}

window.addEventListener('DOMContentLoaded', function(){
    const links = document.querySelectorAll("nav a");

    links.forEach(function (link) {
        link.addEventListener("click", function(e){
            e.preventDefault();
            const sectionId = link.getAttribute("href");
            scrollToSection(sectionId);
        })
    })
})

// Slider e carrossel 
const bannerSlider = document.querySelector('.slider-carroussel'); 
const bannerImages = document.querySelectorAll('.slider-carroussel img'); 
const bannerPrevBtn = document.getElementById('preBtn-carroussel'); 
const bannerNextBtn = document.getElementById('nextBtn-carroussel');

const originalImageCount = bannerImages.length - 2;
let currentImageIndex = 1;
let slideInterval;

// Função para mover o slide automáticamente

bannerSlider.style.transform = `translateX(${-currentImageIndex * 100}%)`;
const banner = (transition = true) => {
    bannerSlider.style.transition = transition ? 'transform 0.5s ease-in-out' : 'none';
    bannerSlider.style.transform = `translateX(${-currentImageIndex * 100}%)`;
};

const nextBanner = () => {
    if (currentImageIndex >= originalImageCount) {
        currentImageIndex = originalImageCount + 1;
        banner();
        setTimeout(() => {
            currentImageIndex = 1;
            banner(false);
        }, 500);
    } else {
        currentImageIndex++;
        banner();
    }
} 

const prevBanner = () => {
    if(currentImageIndex <= 1) {
        currentImageIndex = 0;
        banner();
        setTimeout(() => {
            currentImageIndex = originalImageCount;
            banner(false);
        }, 500);
    } else {
        currentImageIndex--;
        banner();
    }
};

// Função para iniciar o deslizamento automático

const startAutoSlide = () => {
    slideInterval = setInterval(nextBanner, 3000);
};

// Função para desligar automáticamente

const stopAutoSlide = () => {
    clearInterval(slideInterval);
};

// Adicionando os eventos nos botões

bannerNextBtn.addEventListener("click", () => {
    stopAutoSlide();
    nextBanner();
    startAutoSlide();
});

bannerPrevBtn.addEventListener("click", () => {
    stopAutoSlide();
    prevBanner();
    startAutoSlide();
});

// evento de pausar ao passar o mouse
bannerSlider.addEventListener("mouseenter", stopAutoSlide);
bannerSlider.addEventListener("mouseleave", startAutoSlide);

banner(false);
startAutoSlide();

// Contato do site

document.addEventListener("DOMContentLoaded", function(){
    const form = document.querySelector("form");
    const successMessage = document.getElementById("success-message");
    const errorMessage = document.getElementById("error-message");
    const loadingMessage = document.getElementById("loading");

    form.addEventListener("submit", function(e){
        e.preventDefault();

        const name = document.getElementById("name").value;
        const email = document.getElementById("email").value;
        const cellphone = document.getElementById("cellphone").value;
        const subject = document.getElementById("subject").value;
        const message = document.getElementById("message").value;

        form.style.display = "none";
        successMessage.style.display = "none";
        errorMessage.style.display = "none";
        loadingMessage.style.display = "block";

        // Chamando API de envio de email

        const data = {
            to: "lucasmrsilva1198@gmail.com",
            from: "lucasmrsilva1198@gmail.com",
            subject: "Contato do site",
            text: "Contato do site",
            html: `<p>Nome: ${name}</p><br/><p>Email: ${email}</p><br/><p>Celular: ${cellphone}</p><br/><p>Assunto: ${subject}</p><br/><p>Messagem: ${message}</p>`
        }

        fetch("https://api-mail-gun-3ewc.onrender.com/send-email", {
            method: "POST",
            headers: {
                "content-Type": "application/json",
            },
            body: JSON.stringify(data)
        }).then(res => {
            if(res.ok){
                loadingMessage.style.display = "none";
                successMessage.style.display = "block";
            } else {
                loadingMessage.style.display = "none";
                errorMessage.style.display = "block";
                console.error("Erro na resposta da API");
            }
        }).catch((error) => {
            loadingMessage.style.display = "none";
            errorMessage.style.display = "block";
            console.error(`Erro na resposta da API: ${error}`);
        })
    })
})