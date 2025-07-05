<script setup>
import { ref } from 'vue'
import client, { initialize } from '../json_client'
import { showPDF } from '../pdf'

const iframe = ref(null)

function submitCredentials(e) {
    e.preventDefault()
    const fd = new FormData(e.target)
    e.target.querySelector('button').disabled = true
    initialize(fd.get('username'), fd.get('password')).then(() => document.querySelector('#matr-form').querySelector('button').disabled = false)
}

function submitMatricule(e) {
    showStudentPdf(new FormData(e.target).get('matricule'))
}

async function showStudentPdf(matricule) {

    const response = await client.request('etudiant~vinscriptionext:findby', {
        conditions: {
            conditions: [
                { field: "etu_dossier", op: "=", val: matricule.toString() },
                { field: 'anac_annee', op: '=', val: '2024' }
            ]
        }

    })

    const student = response.data.at(0);

    console.dir(student)

    showPDF(iframe.value, getFullname(student),
        isFemale(student),
        getFullAddress(student),
        getBirthdate(student),
        getBirthplace(student),
        getStudiesName(student))
}

function getStudiesName(student) {
    return student.gaesup_lib;
}

function getBirthplace(student) {
    return `${student.etu_villenais}, ${student.paysnais_libcourt}`;
}

function getBirthdate(student) {
    return student.etu_datenais;
}

function getFullAddress(student) {
    return `${student.adr_rue}${student.adr_num ? `, ${student.adr_num}` : ''}${student.adr_bt ? `bte ${student.adr_bt}` : ""}\n${student.adr_cp} ${student.adr_loc}\n${student.paysadr_libcourt}`;
}

function isFemale(student) {
    return student.etu_sexe === "F";
}

function getFullname(student) {
    return `${student.etu_prenom} ${student.etu_nom.toUpperCase()}`;
}

</script>

<template>
    <form id="login-form" @submit="submitCredentials">
        Login: <input type="text" name="username" />

        Password: <input type="password" name="password" />

        <button>Login</button>
    </form>

    <form id="matr-form" @submit.prevent="submitMatricule">
        Matricule <input type="number" name="matricule" id="">
        <button disabled>Show PDF</button>
    </form>

    <iframe width="100%" height="1000px" ref="iframe"></iframe>
</template>
