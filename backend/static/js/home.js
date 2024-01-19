document.addEventListener('DOMContentLoaded', function () {
    displayAllVotings();
    function displayAllVotings() {
        fetch('/home/get_all_votings')
            .then(response => response.json())
            .then(data => {
                clearVotings();

                for (let index in data) {
                    const voting = data[index];
                    const votingElement = createVotingElement(index, voting.topic, voting.description);
                    document.getElementById('voting-list').appendChild(votingElement);
                }

                addVotingClickEvent(data);
            })
            .catch(error => console.error('Error:', error));
    }

    function clearVotings() {
        const votingList = document.getElementById('voting-list');
        while (votingList.firstChild) {
            votingList.removeChild(votingList.firstChild);
        }
    }

    function createVotingElement(index, topic, description) {
        const votingElement = document.createElement('li');
        votingElement.className = 'list-group-item';
        votingElement.dataset.index = index;
        votingElement.innerHTML = `
            <div class="voting-content">
                <strong>Тема: ${topic}</strong><br>
                Описание: ${description}<br>
            </div>
            <button class="btn btn-secondary vote-button" data-bs-toggle="modal" data-bs-target="#votingModal">Голосовать</button>
        `;
        return votingElement;
    }


    function addVotingClickEvent(data) {
        const votings = document.getElementsByClassName('voting');
        for (let voting of votings) {
            voting.addEventListener('click', function () {
                const index = this.dataset.index;
                const votingData = data[index];
                openModal(index, votingData);
            });
        }

        const voteButtons = document.getElementsByClassName('vote-button');
        for (let voteButton of voteButtons) {
            voteButton.addEventListener('click', function (event) {
                event.stopPropagation();

                const votingElement = this.closest('.list-group-item');
                const index = votingElement.dataset.index;
                const votingData = data[index];
                openModal(index, votingData);
            });
        }
    }

    function openModal(index, votingData) {
        const modal = new bootstrap.Modal(document.getElementById('votingModal'));
        const modalTitle = document.getElementById('modalTitle');
        const modalBody = document.getElementById('modalBody');
        const voteButton = document.getElementById('voteButton');

        modalTitle.innerText = votingData.topic;

        modalBody.innerHTML = '';

        const descriptionElement = document.createElement('p');
        descriptionElement.innerText = `Описание: ${votingData.description}\nКоличество проголосовавших: ${votingData.votes.reduce((a, b) => a + b, 0)}`;
        modalBody.appendChild(descriptionElement);

        const totalVotes = votingData.votes.reduce((a, b) => a + b, 0);
        const percentageZeroVotes = totalVotes === 0 ? 0 : 100 / totalVotes;

        for (let optionIndex in votingData.option_indices) {
            const option = votingData.option_indices[optionIndex];
            const votes = votingData.votes[optionIndex];
            const percentage = totalVotes === 0 ? percentageZeroVotes : votes / totalVotes * 100;
            const radioInput = createRadioInput(optionIndex, option, votes, percentage);
            modalBody.appendChild(radioInput);
        }

        voteButton.onclick = function () {
            const selectedOption = document.querySelector('input[name="options"]:checked');
            if (selectedOption) {
                const optionIndex = selectedOption.value;
                sendVote(index, optionIndex);
                displayAllVotings();
            } else {
                Swal.fire({text: "Выберите вариант ответа",icon: "question"});
            }
        };

        modal.show();

        const closeButton = document.querySelector('.modal button[data-bs-dismiss="modal"]');
        closeButton.addEventListener('click', function () {
            modal.hide();
            document.querySelector("body > div.modal-backdrop.show").remove();
        });
    }

    function createRadioInput(index, option, votes, percentage) {
        const radioInput = document.createElement('div');
        radioInput.className = 'form-check';
        radioInput.innerHTML = `
        <input class="form-check-input" type="radio" name="options" value="${index}">
        <label class="form-check-label">${option} (${percentage.toFixed(2)}%)</label>
    `;
        return radioInput;
    }

    function sendVote(proposalIndex, optionIndex) {
        const data = {
            proposal_index: parseInt(proposalIndex),
            option_index: parseInt(optionIndex)
        };

        fetch('/home/vote', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    Swal.fire({icon: "success", title: "Ваш голос успешно учтен"});

                    const participatedVotings = JSON.parse(localStorage.getItem('participatedVotings')) || [];
                    participatedVotings.push(proposalIndex);
                    localStorage.setItem('participatedVotings', JSON.stringify(participatedVotings));
                } else {
                    Swal.fire({icon: "error", title: "Вы уже участвовали в этом голосовании"});
                }
            })
            .catch(error => Swal.fire({icon: "error", title: "Ошибка!", text: error}));
    }

    const addVotingButton = document.getElementById('addVotingButton');
    if (addVotingButton) {
        addVotingButton.addEventListener('click', function () {
            const addVotingModal = new bootstrap.Modal(document.getElementById('addVotingModal'));
            const closeModal = document.getElementById("close_modal_b");
            closeModal.addEventListener('click', ()=>{
                addVotingModal.hide();
            })
            addVotingModal.show();
        });
    }

    const addOptionButton = document.getElementById('addOptionButton');
    const addVotingForm = document.getElementById('addVotingForm');

    addOptionButton.addEventListener('click', function () {
        const optionInputs = addVotingForm.querySelectorAll('input[type="text"]');
        const optionIndex = optionInputs.length;

        if (optionIndex > 10) {
            Swal.fire({text: "Достигнуто максимальное количество вариантов ответа (10)",icon: "question"});
            return;
        }

        const newOptionInput = document.createElement('div');
        newOptionInput.className = 'input-group mb-3';
        newOptionInput.innerHTML = `
        <input type="text" class="form-control" id="option${optionIndex}" placeholder="Вариант ответа ${optionIndex}">
        <button type="button" class="btn btn-danger" style="margin-top:5px" id="removeOptionButton${optionIndex}">Удалить</button>`;

        addVotingForm.insertBefore(newOptionInput, addOptionButton);

        const removeOptionButton = document.getElementById(`removeOptionButton${optionIndex}`);
        removeOptionButton.addEventListener('click', function () {
            addVotingForm.removeChild(newOptionInput);
        });
    });

    function clearVotingForm() {
        const form = document.getElementById('addVotingForm');
        const formInputs = form.querySelectorAll('input[type="text"]');
        const topicInput = document.getElementById('votingTopic');
        const descriptionInput = document.getElementById('votingDescription');

        formInputs.forEach((input, index) => {
            if (index > 0) {
                input.value = '';
            }
        });

        topicInput.value = '';
        descriptionInput.value = '';
    }

    const createVotingButton = document.getElementById('createVotingButton');
    createVotingButton.addEventListener('click', function () {
        const topic = document.getElementById('votingTopic').value;
        const description = document.getElementById('votingDescription').value;

        if (!topic || !description) {
            Swal.fire({text: "Заполните тему и описание голосования",icon: "question"});
            return;
        }

        const options = [];

        for (let i = 1; i <= 10; i++) {
            const optionInput = document.getElementById(`option${i}`);
            if (optionInput) {
                const optionValue = optionInput.value.trim();
                if (!optionValue) {
                    Swal.fire({text: `Заполните все варианты ответа (включая вариант ответа ${i})`,icon: "question"});
                    return;
                }
                options.push(optionValue);
            }
        }

        const data = {
            topic: topic,
            description: description,
            options: options
        };

        fetch('/home/create_voting', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
            .then(response => response.json())
            .then(data => {
                Swal.fire({text: `${data.success}`,icon: "success"});
                if (data.success) {
                    const addVotingModal = new bootstrap.Modal(document.getElementById('addVotingModal'));
                    addVotingModal.hide();
                    displayAllVotings();
                    clearVotingForm();
                }
            })
            .catch(error => console.error('Error:', error));
    });
});