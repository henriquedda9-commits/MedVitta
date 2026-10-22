
const specialties = [
    {
        name: "Neurologia",
        icon: "🧠",
        description: "Cuidados com o sistema nervoso"
    },
    {
        name: "Endocrinologia",
        icon: "⚕",
        description: "Hormônios e metabolismo"
    },
    {
        name: "Neurocirurgia",
        icon: "✚",
        description: "Tratamento neurocirúrgico"
    },
    {
        name: "Traumatologia",
        icon: "🦴",
        description: "Ossos, músculos e articulações"
    },
    {
        name: "Cirurgia vascular",
        icon: "♡",
        description: "Saúde dos vasos sanguíneos"
    },
    {
        name: "Cirurgia geral",
        icon: "✚",
        description: "Avaliação e tratamento cirúrgico"
    },
    {
        name: "Dermatologia",
        icon: "✧",
        description: "Cuidados com a pele"
    },
    {
        name: "Clínica geral",
        icon: "＋",
        description: "Cuidado integral com a saúde"
    }
];

const doctors = [
    { name: "Tatiane Pinto", specialty: "Neurologia" },
    { name: "Carolina Moreira", specialty: "Neurologia" },

    { name: "Monica Poffo", specialty: "Endocrinologia" },
    { name: "Daniela Zambrano", specialty: "Endocrinologia" },

    { name: "Foster", specialty: "Neurocirurgia" },
    { name: "Dalsin", specialty: "Neurocirurgia" },
    { name: "Francisco Braga", specialty: "Neurocirurgia" },

    { name: "Marini", specialty: "Traumatologia" },
    { name: "Dallacqua", specialty: "Traumatologia" },
    { name: "Murilo", specialty: "Traumatologia" },
    { name: "Rocha", specialty: "Traumatologia" },

    { name: "Aline", specialty: "Cirurgia vascular" },
    { name: "Ricardo Nogueira", specialty: "Cirurgia vascular" },
    { name: "Camilla", specialty: "Cirurgia vascular" },

    { name: "Gustavo Martins", specialty: "Cirurgia geral" },
    { name: "Debora Risoto", specialty: "Cirurgia geral" },
    { name: "Kamila Souza", specialty: "Cirurgia geral" },

    { name: "Leticia Duppont", specialty: "Dermatologia" },
    { name: "Eduardo Mertens", specialty: "Dermatologia" },

    { name: "Alejandro", specialty: "Clínica geral" },
    { name: "Henrique Corrêa", specialty: "Clínica geral" }
];

// Elementos principais da página
const specialtyGrid = document.getElementById("specialty-grid");
const doctorGrid = document.getElementById("doctor-grid");
const specialtyFilter = document.getElementById("specialty-filter");
const searchInput = document.getElementById("search-input");
const emptyMessage = document.getElementById("empty-message");

const appointmentSpecialty = document.getElementById(
    "appointment-specialty"
);
const appointmentDoctor = document.getElementById(
    "appointment-doctor"
);
const appointmentDate = document.getElementById("appointment-date");
const appointmentForm = document.getElementById("appointment-form");
const formFeedback = document.getElementById("form-feedback");

let selectedSpecialty = "Todas";

// Cria as iniciais dos nomes dos médicos
function getInitials(name) {
    return name
        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .map(part => part.charAt(0).toUpperCase())
        .join("");
}

// Exibe os cartões das especialidades
function renderSpecialties() {
    specialtyGrid.innerHTML = "";

    specialties.forEach(specialty => {
        const card = document.createElement("button");

        card.type = "button";
        card.className = "specialty-card";
        card.setAttribute(
            "aria-label",
            `Ver médicos de ${specialty.name}`
        );

        card.innerHTML = `
            <span class="specialty-icon" aria-hidden="true">
                ${specialty.icon}
            </span>
            <h3>${specialty.name}</h3>
            <p>${specialty.description}</p>
        `;

        card.addEventListener("click", () => {
            selectedSpecialty = specialty.name;
            specialtyFilter.value = specialty.name;
            appointmentSpecialty.value = specialty.name;

            updateAppointmentDoctors();
            renderDoctors();

            document.getElementById("medicos").scrollIntoView({
                behavior: "smooth"
            });
        });

        specialtyGrid.appendChild(card);
    });
}

// Preenche os filtros e o formulário
function populateSpecialtyOptions() {
    specialties.forEach(specialty => {
        const filterOption = document.createElement("option");

        filterOption.value = specialty.name;
        filterOption.textContent = specialty.name;

        specialtyFilter.appendChild(filterOption);

        const appointmentOption = document.createElement("option");

        appointmentOption.value = specialty.name;
        appointmentOption.textContent = specialty.name;

        appointmentSpecialty.appendChild(appointmentOption);
    });
}

// Exibe e filtra os médicos
function renderDoctors() {
    const searchTerm = searchInput.value
        .trim()
        .toLocaleLowerCase("pt-BR");

    const filteredDoctors = doctors.filter(doctor => {
        const matchesSpecialty =
            selectedSpecialty === "Todas" ||
            doctor.specialty === selectedSpecialty;

        const matchesSearch =
            doctor.name
                .toLocaleLowerCase("pt-BR")
                .includes(searchTerm) ||
            doctor.specialty
                .toLocaleLowerCase("pt-BR")
                .includes(searchTerm);

        return matchesSpecialty && matchesSearch;
    });

    doctorGrid.innerHTML = "";

    filteredDoctors.forEach(doctor => {
        const card = document.createElement("article");
        card.className = "doctor-card";

        const avatar = document.createElement("div");
        avatar.className = "doctor-avatar";
        avatar.textContent = getInitials(doctor.name);
        avatar.setAttribute("aria-hidden", "true");

        const info = document.createElement("div");
        info.className = "doctor-info";

        const specialtyLabel = document.createElement("span");
        specialtyLabel.className = "doctor-specialty";
        specialtyLabel.textContent = doctor.specialty;

        const name = document.createElement("h3");
        name.textContent = doctor.name;

        const button = document.createElement("button");
        button.type = "button";
        button.className = "doctor-button";
        button.textContent = "Solicitar agendamento ↗";

        button.addEventListener("click", () => {
            appointmentSpecialty.value = doctor.specialty;

            updateAppointmentDoctors();

            appointmentDoctor.value = doctor.name;

            document.getElementById("agendamento").scrollIntoView({
                behavior: "smooth"
            });

            appointmentDoctor.focus({
                preventScroll: true
            });
        });

        info.appendChild(specialtyLabel);
        info.appendChild(name);
        info.appendChild(button);

        card.appendChild(avatar);
        card.appendChild(info);

        doctorGrid.appendChild(card);
    });

    emptyMessage.hidden = filteredDoctors.length > 0;
}

// Atualiza a lista de médicos do formulário
function updateAppointmentDoctors() {
    const chosenSpecialty = appointmentSpecialty.value;
    const previousDoctor = appointmentDoctor.value;

    appointmentDoctor.innerHTML = "";

    const defaultOption = document.createElement("option");
    defaultOption.value = "";

    if (!chosenSpecialty) {
        defaultOption.textContent =
            "Selecione a especialidade primeiro";

        appointmentDoctor.appendChild(defaultOption);
        appointmentDoctor.disabled = true;

        return;
    }

    defaultOption.textContent = "Selecione um médico";
    appointmentDoctor.appendChild(defaultOption);

    const availableDoctors = doctors.filter(doctor => {
        return doctor.specialty === chosenSpecialty;
    });

    availableDoctors.forEach(doctor => {
        const option = document.createElement("option");

        option.value = doctor.name;
        option.textContent = doctor.name;

        appointmentDoctor.appendChild(option);
    });

    appointmentDoctor.disabled = false;

    const doctorStillAvailable = availableDoctors.some(doctor => {
        return doctor.name === previousDoctor;
    });

    if (doctorStillAvailable) {
        appointmentDoctor.value = previousDoctor;
    }
}

// Filtro por especialidade
specialtyFilter.addEventListener("change", () => {
    selectedSpecialty = specialtyFilter.value;
    renderDoctors();
});

// Pesquisa por nome ou especialidade
searchInput.addEventListener("input", () => {
    selectedSpecialty = "Todas";
    specialtyFilter.value = "Todas";

    renderDoctors();
});

// Atualiza os médicos ao escolher uma especialidade
appointmentSpecialty.addEventListener("change", () => {
    updateAppointmentDoctors();
});

// Impede a seleção de uma data anterior a hoje
function setMinimumDate() {
    const now = new Date();

    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");

    appointmentDate.min = `${year}-${month}-${day}`;
}

appointmentDate.addEventListener("change", () => {
    if (
        appointmentDate.value &&
        appointmentDate.value < appointmentDate.min
    ) {
        appointmentDate.value = "";
    }
});

// Validação do formulário demonstrativo
appointmentForm.addEventListener("submit", event => {
    event.preventDefault();

    formFeedback.className = "form-feedback";
    formFeedback.textContent = "";

    if (!appointmentForm.checkValidity()) {
        appointmentForm.reportValidity();
        return;
    }

    const patientName = document
        .getElementById("patient-name")
        .value
        .trim();

    const doctorName = appointmentDoctor.value;

    if (!patientName || !doctorName) {
        formFeedback.className = "form-feedback error";

        formFeedback.textContent =
            "Confira os campos e selecione um médico antes de continuar.";

        return;
    }

    const chosenDoctor = doctors.find(doctor => {
        return doctor.name === doctorName;
    });

    if (
        !chosenDoctor ||
        chosenDoctor.specialty !== appointmentSpecialty.value
    ) {
        formFeedback.className = "form-feedback error";

        formFeedback.textContent =
            "Selecione um médico válido para a especialidade escolhida.";

        return;
    }

    formFeedback.className = "form-feedback success";

    formFeedback.textContent =
        `Solicitação demonstrativa preenchida com sucesso, ${patientName}! ` +
        `Médico: ${doctorName}. ` +
        "Esta mensagem não confirma uma consulta real.";
});

// Menu para telas pequenas
const menuToggle = document.getElementById("menu-toggle");
const navLinks = document.getElementById("nav-links");

menuToggle.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("open");

    menuToggle.setAttribute("aria-expanded", String(isOpen));

    menuToggle.setAttribute(
        "aria-label",
        isOpen ? "Fechar menu" : "Abrir menu"
    );

    menuToggle.textContent = isOpen ? "✕" : "☰";
});

// Fecha o menu ao clicar em um link
navLinks.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
        navLinks.classList.remove("open");

        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.setAttribute("aria-label", "Abrir menu");

        menuToggle.textContent = "☰";
    });
});

// Inicialização do site
document.addEventListener("DOMContentLoaded", () => {
    const requiredElements = [
        specialtyGrid,
        doctorGrid,
        specialtyFilter,
        searchInput,
        emptyMessage,
        appointmentSpecialty,
        appointmentDoctor,
        appointmentDate,
        appointmentForm,
        formFeedback,
        menuToggle,
        navLinks
    ];

    if (requiredElements.some(element => !element)) {
        console.error(
            "MedVitta: um ou mais elementos HTML não foram encontrados. Confira os IDs do index.html."
        );

        return;
    }

    populateSpecialtyOptions();
    renderSpecialties();
    renderDoctors();
    updateAppointmentDoctors();
    setMinimumDate();

    const currentYear = document.getElementById("current-year");

    if (currentYear) {
        currentYear.textContent = new Date().getFullYear();
    }
});
