window.addEventListener("DOMContentLoaded", () => {
    let resposta ; 
    try{
        resposta = JSON.parse(sessionStorage.getItem('resposta'));
    }catch (e){
        console.error("Erro ao parsear resposta do sessionStorage:", e);
        resposta = [];
    }
    
    const chatDiv = document.getElementById("chat");
    let resp ;

    if (!sessionStorage.getItem("historicoChat")) {
        sessionStorage.setItem("historicoChat", JSON.stringify([]));
    }

    if (resposta && Array.isArray(resposta)) {
        // Exibe as mensagens da IA com base na resposta recebida
        resposta.forEach((item, index) => {
            const iaMessage = document.createElement("div");
            iaMessage.className = 'chat-message ia-message';
            iaMessage.innerHTML = `
                <strong>Exercício ${index + 1}: ${item.exercicio}</strong><br>
                <strong>Descrição:</strong> ${item.descricao}<br>
                <strong>Frequência:</strong> ${item.frequencia}<br>
                <strong>Intensidade:</strong> ${item.intensidade}<br>
                <strong>Plano Alimentar:</strong> ${item.plano_alimentar}<br>
                <strong>Link de artigo:</strong> <a href="${item.link_de_artigos}" target="_blank" rel="noopener noreferrer">${item.link_de_artigos}</a>
            `;
            chatDiv.appendChild(iaMessage);
            resp = `Exercício: ${item.exercicio}, Descrição: ${item.descricao}, Frequência: ${item.frequencia}, Intensidade: ${item.intensidade}, Plano Alimentar: ${item.plano_alimentar}, Link: ${item.link_de_artigos}`
            historico(resp,"...")
        }
        
    );
    
        
        // Rola até o final da conversa
        chatDiv.scrollTop = chatDiv.scrollHeight;
    } else {
        const noData = document.createElement("div");
        noData.className = "chat-message ia-message";
        noData.textContent = "Nenhuma resposta disponível.";
        chatDiv.appendChild(noData);
    }

       
    
    

});

    


function historico(respostaIA, conteudoUser) {
    const dados = {
        model: respostaIA,
        user: conteudoUser ?? ""
    };

    // Se já existe histórico, recupera. Senão, começa com array vazio.
    const lista = JSON.parse(sessionStorage.getItem("historicoChat")) || [];

    // Adiciona o novo item
    lista.push(dados);
    console.log(lista)
    // Salva o histórico atualizado
    sessionStorage.setItem("historicoChat", JSON.stringify(lista));
    
}


const urlbase = "http://localhost:8080/chat"
async function sendData(mensagem) {

    const contents =JSON.parse(sessionStorage.getItem("historicoChat")) ||[];

    const datas =  {
        contents: contents,
        mensagem: mensagem
    }
     try {
        const response = await fetch(urlbase, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(datas)
        });

        if (!response.ok) {
            const errorData = await response.json();
            alert("Erro na hora de processar");
            throw new Error(errorData.message || "Erro no request");
        }
        const text = await response.text();
       // historico(text, mensagem);
        //console.log('resposta salva:', text);
        historico(text, mensagem);
        adicionarMensagemAoChat("ia", text); // Exibe balão da IA
        console.log('resposta salva:', text);
    } catch (error) {
        console.error(error);
    }
}

document.getElementById("enviar-mensagem").addEventListener("click", function(event){
    event.preventDefault();
    const mensagem = document.getElementById("user-input").value
     if (mensagem.trim() !== "") {
        adicionarMensagemAoChat("user", mensagem); // Exibe balão do usuário
        sendData(mensagem);
        document.getElementById("user-input").value = ""; // Limpa o campo
    }
    //sendData(mensagem);
})


function adicionarMensagemAoChat(tipo, mensagem) {
    const chatDiv = document.getElementById("chat");
    const messageDiv = document.createElement("div");

    messageDiv.className = `chat-message ${tipo === 'user' ? 'user-message' : 'ia-message'}`;

    if (tipo === 'ia') {
        // Converte Markdown em HTML
        messageDiv.innerHTML = marked.parse(mensagem);
    } else {
        // Apenas texto puro para o usuário
        messageDiv.textContent = mensagem;
    }

    chatDiv.appendChild(messageDiv);
    chatDiv.scrollTop = chatDiv.scrollHeight;
}
