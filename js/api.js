var API_MARVEL_KEY_PUB = "c9b76a58713477f9995bed5d889e1b2f";
var API_MARVEL_KEY_PRI = "63c8dae3cf822f64a3b598097babf8261a7e6721";
var HASH = "fb5f17fae46b5ae3cb457810167a8591";
var TIME_STAMP = 200;

function getMarvelData() {

  var loading__spinner = document.getElementById('loading__request');
  loading__spinner.style.visibility = "visible";
  loading__spinner.style.opacity = "1";

  var sSearchValue = document.getElementById('search__value');
  var API_MARVEL_URL = "https://gateway.marvel.com:443/v1/public/characters?nameStartsWith=" + sSearchValue.value + "&apikey=" + API_MARVEL_KEY_PUB + "&hash=" + HASH + "&ts=" + TIME_STAMP;
  var req = new XMLHttpRequest();
  req.open('GET', API_MARVEL_URL, true);
 console.log(API_MARVEL_URL);
  req.onreadystatechange = function(aEvt) {
    if (req.readyState == 4) {
      if (req.status == 0) {
        var sTitle = "Solicitud denegada";
        var sDescription = "Actualmente su dispositivo no se encuentra conectado a internet, verifique su conexión e intentelo de nuevo!";
        ShowModal(sTitle, sDescription);
      }

      if (req.status == 200) {

        var loading__spinner = document.getElementById('loading__request');
        loading__spinner.style.visibility = "hidden";
        loading__spinner.style.opacity = "0";

        var oAllData = JSON.parse(req.responseText);
        var sIsContent = oAllData.data.total;

        if (sIsContent == 0) {
          var sTitle = "Consulta errónea";
          var sDescription = "El personaje que está intentando buscar no se encuentra en nuestra base de datos, por favor intente de nuevo!";
          ShowModal(sTitle, sDescription);
        } else {

          var input__disable = document.getElementById("search__value");
          input__disable.disabled = true;
          input__disable.placeholder = "First push refresh button";
          
          var oCharactersInfo = oAllData.data.results;
          var nlength = oAllData.data.count;
          var oDescriptionCharacters = {
            accounting: []
          };
          for (var i = 0; i < nlength; i++) {
            var sName_Character = oCharactersInfo[i].name;
            var sDescription_Character = oCharactersInfo[i].description;
            var sUrl_img = oCharactersInfo[i].thumbnail.path + "." + oCharactersInfo[i].thumbnail.extension;
            var PaperCardCharacter = document.createElement('div');
            PaperCardCharacter.className = 'Paper__Card';
            var imgCharacter = document.createElement('img');
            imgCharacter.src = sUrl_img;
            imgCharacter.className = 'img__Character';
            var ContentCharacter = document.createElement('div');
            ContentCharacter.className = 'container';
            var textNameh4 = document.createElement("H5");
            textNameh4.className = 'title__content';
            var buttonElement = document.createElement("BUTTON");
            var buttonText = document.createTextNode("Ver más (+)");
            var textName = document.createTextNode(sName_Character);
            if (sDescription_Character.length == 0) {
              var str = "no tienen ninguna descripción para visualizar!";
              var textDescription = document.createTextNode(str);
              oDescriptionCharacters.accounting.push({
                "id": i,
                "namechar": sName_Character,
                "description": sName_Character + " " +str
              });
            } else {
              oDescriptionCharacters.accounting.push({
                "id": i,
                "namechar": sName_Character,
                "description": sDescription_Character
              });

            }

            buttonElement.appendChild(buttonText);
            buttonElement.onclick = ShowDescription;
            buttonElement.id = "button-" + i;
            buttonElement.className = 'btn__more';
            textNameh4.appendChild(textName);
            ContentCharacter.appendChild(textNameh4);
            ContentCharacter.appendChild(buttonElement);
            PaperCardCharacter.appendChild(imgCharacter);
            PaperCardCharacter.appendChild(ContentCharacter);
            PaperCardCharacter.id = "Paper__Card";

            document.getElementById("Content__Cards").appendChild(PaperCardCharacter);

          }
          var oDatas = JSON.stringify(oDescriptionCharacters);
          localStorage.setItem("DatasDescription", oDatas);

          var BtnSearch = document.getElementById('btn__refresh');
          BtnSearch.style.visibility = "visible";
          BtnSearch.style.opacity = "1";

          var title__List = document.getElementById('title__Char');
          title__List.style.display = "flex";
          title__List.style.justifyContent = "center";

          location.href = "#title__Char";
        }


      }

        if (req.status == 409) {
          var sTitle = "Error en la petición";
          var sDescription = "No has ingresado ningún valor y la consulta no se ha realizado correctamente\n vuelve a intentarlo";
          ShowModal(sTitle, sDescription);
          var loading__spinner = document.getElementById('loading__request');
          loading__spinner.style.visibility = "hidden";
          loading__spinner.style.opacity = "0";
        }
      }
    }

    req.send();
    sSearchValue.value = "";
  };

function ShowDescription() {
  var ButtonId = this.id.split("-");
  var nNumberButtonId = ButtonId[1];
  var oDataDescription = JSON.parse(localStorage.DatasDescription);
  var sDescriptionChar = oDataDescription.accounting[nNumberButtonId].description;
  var sNameChar = oDataDescription.accounting[nNumberButtonId].namechar;
  var sDescription = sDescriptionChar;
  var sTitle = "Descripción personaje - " + sNameChar;
  ShowModal(sTitle, sDescription);
}

function ShowModal(sTitle, sDescription) {
  var modal = document.getElementById('myModal');
  var paragraph = document.getElementById('text__description');
  var title__T = document.getElementById('title__m');

  title__T.innerHTML = sTitle;
  paragraph.innerHTML = sDescription;

  modal.style.visibility = "visible";
  modal.style.opacity = "1";
}

function span__click() {
  var modal = document.getElementById('myModal');
  modal.style.visibility = "hidden";
  modal.style.opacity = "0";
}

window.onclick = function(event) {
  var modal = document.getElementById('myModal');
  if (event.target == modal) {
      modal.style.visibility = "hidden";
      modal.style.opacity = "0";
  }
}

function getRefresh() {
  document.getElementById("search__value").disabled = false;
  localStorage.removeItem('DatasDescription');
  var title__Char = document.getElementById('title__Char');
  title__Char.remove();
  var Paper__CParent = document.getElementById('Content__Cards');
  while (Paper__CParent.firstChild) {
    Paper__CParent.removeChild(Paper__CParent.firstChild);
  }
  var BtnSearch = document.getElementById('btn__refresh');
  BtnSearch.style.visibility = "hidden";
  BtnSearch.style.opacity = "0";
  location.href = "";
}
