const urlbase = "http://localhost:8080/slim_tech/form"

document.getElementById("btn_enviar").addEventListener("click", function(event){
    event.preventDefault();
    const datas = {
        altura : document.getElementById("altura").value , 
        peso : document.getElementById("peso").value , 
        genero : document.getElementById("genero").value.toUpperCase() , 
        idade : document.getElementById("idade").value  , 
        problemaDeSaude : document.getElementById("problemas_saude").value , 
        metaDoUsuario : document.getElementById("meta_usuario").value 
    }
    sendData(datas);
})

async function sendData(datas) {
    const loading = document.getElementById("loading");
    loading.style.display = "flex";
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

        const data = await response.json();
        sessionStorage.setItem('resposta', JSON.stringify(data))
        alert("Sucesso!");
        window.location.href = "Chat_ia.html"
        console.log('resposta salva:', data);
    } catch (error) {
        console.error(error);
    } finally {
        loading.style.display = "none"; // sempre esconde o loading
    }
}





