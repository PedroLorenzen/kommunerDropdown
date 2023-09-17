// URL til at hente kommuneinformation fra
const urlKommune = "https://api.dataforsyningen.dk/kommuner";

// Metode til at hente data fra en hvilken som helst url
function fetchAnyUrl(url)
{
    console.log("Henter data fra: " + url);
    // Fetcher data og returnerer som JSON
    return fetch(url).then(function (response)
    {
        return response.json();
    });
}

// Metode til at nulstille indholdet af et HTML-element
function clearElement(element)
{
    console.log("Nulstiller HTML element");
    // Tømmer alt indhold i HTML-elementet.
    element.innerHTML = '';
}

// Metode til at skabe en dropdown-option
function createOption(text, value)
{
    console.log("Opretter dropdown element med tekst: " + text + " og værdi: " + value);
    // Opretter et tomt option HTML-element med tekst og værdi.
    const option = document.createElement('option');
    option.text = text;
    option.value = value;
    return option;
}

// Metode der fylder en dropdown med kommuner via createOption
function populateDropdown(kommuner, dropdownElement)
{
    console.log("Indsætter element fra createOption i dropdown");
    // Går igennem alle kommuner og indsætter dem i dropdown.
    // function(kommune) er en callback-funktion, der indsætter en kommune i dropdown.
    kommuner.forEach(function (kommune)
    {
        dropdownElement.appendChild(createOption(kommune.navn, kommune.kode));
        console.log(kommune.navn);
    });
}

// Asynkron metode der henter data fra linket og fylder dropdown via populateDropdown
async function fetchAndPopulateDropdown(url, dropdownElement)
{
    console.log("Henter data fra url og indsætter i dropdown");
    // Henter url.
    const kommune = await fetchAnyUrl(url);
    // Indsætter data fra url og dropdown i populateDropdown.
    populateDropdown(kommune, dropdownElement);
}

// Metode til at finde en kommune baseret på navnet
function findKommune(kommuner, kommuneNavn)
{
    console.log("Finder kommune med navn: " + kommuneNavn);

    // Indbygget loop JS-metode der gennemsøger arrayet og returnerer det første element der matcher
    // (function (k) er en callback-funktion, der checker om navnet matcher)
    return kommuner.find(function (k)
    {
        return k.navn.toLowerCase() === kommuneNavn.toLowerCase();
    });
    /* Kan også skrives med forEach loop:
    let foundKommune;
    kommuner.forEach(function(k) {
        if (k.navn.toLowerCase() === kommuneNavn.toLowerCase()) {
            foundKommune = k;
    }});
    return foundKommune;
    */
}

// Metode til at oprette et link-element
function createLink(text, href)
{
    console.log("Genererer link med teksten: " + text);
    // Opretter et tomt a-tag med tekst og href.
    const aTag = document.createElement('a');
    // Indsætter tekst og href i a-tagget.
    aTag.textContent = text;
    aTag.href = href;
    return aTag;
}

// Asynkron metode til at vise link for en given kommune
async function showLinkForKommune(inputElement, linkContainerElement, url)
{
    console.log("Viser link for valgt kommune:" + inputElement.value);
    const inputKommune = inputElement.value;
    const kommuner = await fetchAnyUrl(url);
    const match = findKommune(kommuner, inputKommune);

    // Nulstiller containeren til linket
    clearElement(linkContainerElement);

    // Tjekker, om der er fundet en match, og indsætter linket eller en fejlmeddelelse
    if (match)
    {
        // Indsætter linket i linkContainer (createLink(text, href))
        linkContainerElement.appendChild(
            createLink(`Gå til ${match.navn}`, `https://api.dataforsyningen.dk/kommuner/${match.kode}`)
        );
    }
    else
    {
        linkContainerElement.textContent = 'Kommune ikke fundet';
    }
}

// Event listener for at hente kommuner til dropdown
document.getElementById("pbFetchKommuner").addEventListener('click', function ()
{
    // Henter kommuner og indsætter i dropdown til html ddKommuner div
    fetchAndPopulateDropdown(urlKommune, document.getElementById('ddKommuner'));
});

// Event listener for at finde en kommune
document.getElementById("pbFindKommune").addEventListener('click', function ()
{
    // Finder en kommune og viser linket
    showLinkForKommune(
        // Henter input fra inputfeltet og indsætter i html inputKommune div
        document.getElementById('inputKommune'),
        // Indsætter linket i html linkContainer div
        document.getElementById('linkContainer'),
        // Henter kommuner fra url
        urlKommune
    );
});
