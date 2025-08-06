let lista =[]
function mudarTema() {
    const header = document.querySelector("#header");
    const input = document.querySelector("#input");
    if (header.classList.contains("bg-white")) {
        header.classList.remove("bg-white", "text-black", "fill-black");
        header.classList.add("bg-black", "text-white", "fill-white");

    } else {
        header.classList.remove("bg-black", "text-white", "fill-white");
        header.classList.add("bg-white", "text-black", "fill-black");
        input.classList.add("border-white");

    }
}
// drawer e overlay
// em NOVA TAREFA
function abrirGaveta(editar = false) {
    const sombra = document.querySelector("#sombra");
    const gaveta = document.querySelector("#gaveta");
        const formCriar = document.querySelector("#formCriar");
        const formEditar = document.querySelector("#formEditar");

    if (editar){
        formCriar.classList.add("hidden");
        formEditar.classList.remove("hidden");
    }else{
        formEditar.classList.add("hidden");
        formCriar.classList.remove("hidden");
    }

    sombra.classList.remove("invisible", "opacity-0");
    gaveta.classList.remove("invisible", "opacity-0");
}

function fecharGaveta() {
    const sombra = document.querySelector("#sombra");
    const gaveta = document.querySelector("#gaveta");

    sombra.classList.add("invisible", "opacity-0");
    gaveta.classList.add("invisible", "opacity-0");
}

// (nomes pra dados que estao chegando!!)
function buscarTarefas() {
    fetch("http://localhost:3000/tarefas")
        // quando a promessa for chegar, logo será executado o then()
        .then(function (resposta) {
            // (resposta) é o objeto bruto que vem da requisição
            return resposta.json();
            // converter (resposta) para json
        })
        .then(function (json) {
            // (dados) é o nome escolhido para o resultado em json
            carregarTarefas(json);
            lista = json;

        })
}
// chamando a função
buscarTarefas()


//  o parametro espera eu receber um arrey de tarefas em algum lugar, um complemento, algo que nao esta explicito  no meu codigo.

function carregarTarefas(tarefas) {
    const listaDeTarefas = document.querySelector("#lista-de-tarefas");
    // o .map() significa "para cada tarefa dentro do arrey tarefas, execute essa função aqui"
    
    tarefas.map(function (tarefa) {
        listaDeTarefas.innerHTML += `<div class="bg-white shadow rounded p-4" id="atualizacao" >
                <h3 class="font-bold">${tarefa.titulo}</h3>
                <p class="text-[14px] text-gray-500 line-clamp-3 mb-4">${tarefa.descricao}</p>
                <div class="flex justify-between items-center">
                    <span class="font-bold text-[10px]">${formatarData(tarefa.data)}</span>
                    <div class="flex gap-3">
                        <box-icon name='pencil'onclick="abrirGaveta(true),preencherFormulario(${tarefa.id})"></box-icon>
                        <box-icon name='trash' onclick="deletarTarefa(${tarefa.id})"></box-icon>
                    </div>
                </div>
            </div>`;
    })

}
function criarTarefa(){
    event.preventDefault();

    fetch("http://localhost:3000/tarefas",{
        method: "post",
        headers: {
            "content-type": "application/json"
        },
        body: JSON.stringify(capturarDados("#formCriar"))
    })
}

function editarTarefa() {
    // impede o envio automatico do formulario na mesma pagina web "evitar comportamento padrao"

    event.preventDefault();
 const id = document.querySelector("#formEditar input[name = 'tarefa_id']").value;
    fetch(`http://localhost:3000/tarefas/${id}`, {
        // define que a requisicao é do tipo post
        method: "put",
        // informa que os dados enviados são em json
        headers: {
            "Content-type": "application/json"
        },
        body: JSON.stringify(capturarDados("#formEditar"))
    })
}
// funcao que captura os dados de um formulario html, ele vai entender que o "idDeUmFormulario é #formCriar"
function capturarDados(idDeUmFormulario) {
    let form = document.querySelector(idDeUmFormulario);
    // data -> dados , entries -> entradas, itens, pares, registros

    //formData é uma ferramenta do js usado para capturar automaticamente todos os  campos preenchidos de um formulario HTML

    let formData = new FormData(form);
    //  fromData.entries() gera uma lista de pares chave-valor ex: [["nome","vitoria"], ["idade","20"]]

    let dados = Object.fromEntries(formData.entries())
    //  object.fromEntries() recebe essa lista e transforma em objeto js com chaves e valores definido ex: {nome: "vitoria", idade: "20"}
    
    let data = new Date();
    dados.data = data.toLocaleDateString().split('/').reverse().join('-');
    return dados;
    

}

function formatarData(data){
 let dataFormatada = new Date(data);
 return dataFormatada.toLocaleDateString();
}

// confirm por si ele nao funciona, mesmo clicando em cancelar ele apaga!, entao uma condição seria o mais adequado usar. "Se a resposta da caixinha de confirmação for 'OK', então execute o código dentro do bloco."

function deletarTarefa(idDaTarefa) {
      let confirmou = confirm("Deseja realmente apagar este item?");
    if(confirmou){
        fetch(`http://localhost:3000/tarefas/${idDaTarefa}`, {
            method: "delete",
        })
    }
}

function preencherFormulario(idDaTarefa){
    let idValue =document.querySelector("#formEditar input[name='tarefa_id']");

    let tituloValue = document.querySelector("#formEditar input[name='titulo']");

    let descricaoValue = document.querySelector("#formEditar textarea[ name= 'descricao']");

    let tarefa = lista.find(item => item.id == idDaTarefa);
    idValue.value = tarefa.id;
    tituloValue.value = tarefa.titulo;
    descricaoValue.value = tarefa.descricao;
}
