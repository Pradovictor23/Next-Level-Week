/* Função anonima: função que n tem nome..... um tipo de função anonima (algo) => {return banana}   .. arrowfunction*/
    

/* to usando o fetch, que é uma função que retorna uma promise, vou acessar o site do ibge e qnd voltar, o then vai executar 
essa função anonima "(resp) => {return resp.json()}" (onde resp é a resposta que o fetch trouxe e o resp.json é basicamente transformar
ela em um JSON- JavaScript Object Notation). O "resp.json()" tbm é uma promessa; então faremos ele retornar na função. O que me permitirá usar
o "then" do próprio "resp.json()" (ou seja, ele vai dar uma nova promessa pro "then" de fora) que vai me retornar uma resposta onde vou popular os estados no select */
    function populateStates(){
        const stateSelect = document.querySelector("select[name=uf]");

        fetch("https://servicodados.ibge.gov.br/api/v1/localidades/estados")
        .then( (resp) => {return resp.json()})
        .then( (states) => {
            for(const uf of states){
                stateSelect.innerHTML += `<option value="${uf.id}">${uf.nome}</option>`    
            }        
        });
    }

    populateStates();

    /* sempre que entrar no change podemos pegar o evento na função */
    /*o evento traz um monte de informações, uma delas é o target(onde o evento foi executado, que no caso foi no "select[name=state]")
    dentro do target vc pode pegar o valor dele(value[que por sua vez é aquele "state.id"])*/
    /*indexOfSelectedState => p armazenar o numero do estado selecionado, que é =>event.target.selectedIndex*/
    function getCities(event){
        const citySelect = document.querySelector("select[name=city]");
        const stateInput = document.querySelector("input[name=state]");

        const ufValue = event.target.value;
        const url = `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${ufValue}/municipios`;

        const indexOfSelectedState = event.target.selectedIndex;
        stateInput.value = event.target.options[indexOfSelectedState].text;

        citySelect.innerHTML = "<option value>Selecione a cidade</option>"
        citySelect.disabled = true;


        fetch(url)
        .then(res => res.json())
        .then(cities => {
            for(const city of cities){
                citySelect.innerHTML += `<option value="${city.nome}">${city.nome}</option>`
            }

            citySelect.disabled = false;
        })
    }

    
/* O addEventListener fica atento p qnd tiver algum evento, como por ex uma mudança "change". O primeiro parâmetro da função é o evento e o
segundo espera uma função p ele executar */
    document
    .querySelector("select[name=uf]")
    .addEventListener("change",getCities)  


    //itens de coleta
    //pegar tds os li's

    const itemsToCollect = document.querySelectorAll(".items-grid li")
    
    for( const item of itemsToCollect){
        item.addEventListener("click", handleSelectedItem)
    }

    /* atualizar o campo escondido com os dados selecionados */
    const collectedItems = document.querySelector("input[name=items]");

    let selectedItems = [];

    function handleSelectedItem(event){
        const itemLi = event.target;
        /* adicionar ou remover uma classe com JS 
        add > classList.add("selected")
        remove > classList.remove("selected")
        toggle > adc ou remove classList.toggle("selected")
        */
        itemLi.classList.toggle("selected")

        //vai pegar os numeros que tem no id do li
        const itemId = itemLi.dataset.id;


        /* ver se existem itens selecionados
        se sim, pegar eles
        */
        const alreadySelected = selectedItems.findIndex((item) => {
            const itemFound = item == itemId;
            return itemFound;
        })

        /* se ja estiver selecionado, tirar da seleção */
        if(alreadySelected >=0){
            /* o filter tbm retorna bolleando, se for vddr
            ela vai adc o element no novo array
            se for falso, vai tirar o item do array */
            const filteredItems = selectedItems.filter(item => {
                const itemIsDifferent = item!=itemId
                return itemIsDifferent;
            })
            
            selectedItems = filteredItems;
        }else{
            /* se não tiver, adiciona a seleção */
            selectedItems.push(itemId);
        }
        /* atualizar o campo escondido com os dados selecionados */
        collectedItems.value = selectedItems;
    }
