const firstLine = "Le soussigné Frédéric SERVAIS, Directeur, certifie que :";
const anac = "2025-2026"

const required_files = {
    // an object of images that we will need
    // each value will be populated with another "data" property, containing the actual image (downloaded from above url)

    he2b: {
        url: "resources/logo-he2b-black.png"
    },
    esi: {
        url: "resources/HE2B-16-17150-Logo-ESI.png"
    },
    barrecoloree: {
        url: "resources/barre couleurs.png"
    }
};



const downloadFilesPromises = Object.values(required_files).map(downloadFile);

async function downloadFile(file) {
    file.data = await fetch(file.url)
        .then(r => r.blob())
        .then(r => r.arrayBuffer());
}

export async function showPDF(iframe, fullStudentName, genderIsFemale, fullAddress, dateNaissance, lieuNaissance, bachelier) {

    const doc = new PDFDocument({
        size: 'A4',
        margins: {
            top: 0,
            bottom: 0,
            left: 0,
            right: 0
        }
    });

    const stream = doc.pipe(blobStream());
    stream.on("finish", function () {
        iframe.src = stream.toBlobURL('application/pdf');
    });


    await Promise.all(downloadFilesPromises)

    const e = genderIsFemale ? 'e' : ''

    // pass loaded ArrayBuffer data instead of a path to image
    doc.image(required_files.he2b.data, 10, 10, { fit: [160, 160], backgroundColor: 'black' });

    doc.fontSize(14);
    doc.moveDown(7);
    doc.text("ATTESTATION DE FRÉQUENTATION\ndestinée aux caisses d'allocations familiales\n(non valable sans le cachet de l'établissement)", {
        align: 'center'
    });

    doc.fontSize(11);
    doc.moveDown(2)
    const marge2 = 60;
    doc.text(firstLine, marge2)
    doc.moveDown()

    doc.text(fullStudentName, { align: 'center' })
    doc.moveDown()

    doc.text("domicilié" + e)
    doc.moveUp()
    const marge3 = 160;
    doc.text(fullAddress, marge3)

    doc.moveDown()
    doc.moveDown()

    doc.text("né" + e, 60)
    doc.moveUp()


    doc.text(`le ${dateNaissance} à ${lieuNaissance}`, marge3)

    doc.moveDown()

    doc.text(`est inscrit${e} comme étudiant${e} réguli${e ? 'è' : 'e'}r${e} en ${bachelier}`, marge2)

    doc.moveDown()
    doc.text("domaine :", marge3)
    doc.moveUp();
    const marge4 = 270;
    doc.text("Sciences", marge4)

    doc.text("durée des études :", marge3)
    doc.moveUp();
    doc.text("3 ans (180 crédits)", marge4)

    doc.text("Cours du jour — Enseignement supérieur de plein exercice et de type Court", marge3)
    doc.moveDown()
    doc.text(`dans l'année académique ${anac}`, marge2)
    doc.moveDown()

    doc.text("Début : ...         Fin : ....", marge3)
    doc.text("Vacances d'été du ... au XX/XX/XXXX", marge3)

    doc.moveDown()
    doc.moveDown()

    doc.font('Times-Bold').text("Réponses au questionnaire :", marge2).font('Times-Roman')

    const questionnaire = `41. L'étudiant s'est-il inscrit au plus tard le 30 novembre de l'année académique ${anac} pour au moins 27 crédits ? oui
43. Le jeune suit-il une formation de ministre d'un culte reconnu (catholique, protestan, anglican, israélite, islamique, orthodoxe) ? non
44. L'enseignement scientifique suivi prépare-t-il à l'École royale militaire ? non
46. Le jeune suit-il un master en alternance ? non
72. Le programme d'enseignement comporte-t-il des stages non rémunérés ?
Périodes de stage du .... au .... `;
    doc.translate(40, 5).text(questionnaire, { lineGap: 4, width: 480 })


    doc.image(required_files.esi.data, 45, 730, { fit: [60, 60], backgroundColor: 'black' });

    doc.fontSize(8)
    doc.text("Rue Royale 67 • 1000 Bruxelles • T : +32 ... • F: + 32 ... • esi@he2b.be • www.he2b.be", 50, 785)
    doc.image(required_files.barrecoloree.data, 50, 800, { fit: [100, 100], backgroundColor: 'black' });

    doc.end();
}

