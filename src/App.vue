<script setup>
import { onErrorCaptured, ref, useTemplateRef } from 'vue'
import client from './json_client'
import { showPDF } from './pdf'
import TheLogin from './TheLogin.vue'

const iframe = ref(null)
const loginRef = useTemplateRef("login")
const matricule = ref('')
const errors = ref([])


onErrorCaptured(e => {
    errors.value.push(e)
    return false
})

function showStudentPdf() {
    client.request('etudiant~vinscriptionext:findby', {
        conditions: {
            conditions: [
                { field: "etu_dossier", op: "=", val: matricule.value.toString() },
                { field: 'anac_annee', op: '=', val: '2024' }
            ]
        }
    })
        .then(response => response.data)
        .then(data => {
            console.log("data", data)
            if (!data?.length) return Promise.reject(new Error('No data received.'))
            if (data.length > 1) return Promise.reject(new Error('More than one matching result'))
            return data.at(0)
        })
        .then(student => showPDF(
            iframe.value,
            getFullname(student),
            isFemale(student),
            getFullAddress(student),
            getBirthdate(student),
            getBirthplace(student),
            getStudiesName(student)
        ))
        .catch(e => errors.value.push(e))

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

    

    <div class="error" v-if="errors">
        <div v-for="(e, i) in errors" >
            {{ e }} <button @click="errors.splice(i, 1)">&times;</button>
        </div>
    </div>

    <TheLogin ref="login" />

    <form id="matr-form" @submit.prevent="showStudentPdf">
        Matricule <input type="number" v-model="matricule">
        <button :disabled="loginRef?.isLoading || !loginRef?.isLoggedIn">Show PDF</button>
    </form>

    <iframe width="100%" height="1000px" ref="iframe"></iframe>
</template>
<style>
.error {
    color: red;
}
</style>