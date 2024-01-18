document.addEventListener('DOMContentLoaded', function () {
    // Получение списка голосований при загрузке страницы
    displayAllVotings();

    const allVotingsButton = document.getElementById('allVotingsButton');
    allVotingsButton.addEventListener('click', displayAllVotings);

    // Обработчик события для кнопки "Ваши голосования"
    const yourVotingsButton = document.getElementById('yourVotingsButton');
    yourVotingsButton.addEventListener('click', displayYourVotings);

    // Функция для получения списка голосований и отображения их на странице
    function displayAllVotings() {
        fetch('/home/get_all_votings')
            .then(response => response.json())
            .then(data => {
                // Очищаем предыдущий список голосований
                clearVotings();

                // Создаем элементы для каждого голосования и добавляем их на страницу
                for (let index in data) {
                    const voting = data[index];
                    const votingElement = createVotingElement(index, voting.topic);
                    document.getElementById('voting-list').appendChild(votingElement);
                }

                // Добавляем обработчик события для открытия модального окна при клике на голосование
                addVotingClickEvent(data);
            })
            .catch(error => console.error('Error:', error));
    }

    // СУДА ЗАМЕНИТЬ НА МОИ ГОЛОСОВАНИЯ
    function displayYourVotings() {
        clearVotings();
    }

    // Функция для очистки списка голосований на странице
    function clearVotings() {
        const votingList = document.getElementById('voting-list');
        while (votingList.firstChild) {
            votingList.removeChild(votingList.firstChild);
        }
    }

    // Функция для создания элемента голосования
    function createVotingElement(index, topic) {
        const votingElement = document.createElement('button');
        votingElement.className = 'btn btn-primary voting'; // Добавьте класс voting
        votingElement.dataset.index = index;
        votingElement.innerText = topic;
        return votingElement;
    }

    // Функция для добавления обработчика события при клике на голосование
    function addVotingClickEvent(data) {
        const votings = document.getElementsByClassName('voting');
        for (let voting of votings) {
            voting.addEventListener('click', function () {
                const index = this.dataset.index;
                const votingData = data[index];
                openModal(index, votingData);
            });
        }
    }

    // Функция для открытия модального окна с вариантами ответа
    function openModal(index, votingData) {
        const modal = new bootstrap.Modal(document.getElementById('votingModal'));
        const modalTitle = document.getElementById('modalTitle');
        const modalBody = document.getElementById('modalBody');
        const voteButton = document.getElementById('voteButton');

        // Заголовок модального окна
        modalTitle.innerText = votingData.topic;

        // Очищаем предыдущие варианты ответа
        modalBody.innerHTML = '';

        // Отображение описания голосования и количества проголосовавших
        const descriptionElement = document.createElement('p');
        descriptionElement.innerText = `Описание: ${votingData.description}\nКоличество проголосовавших: ${votingData.votes.reduce((a, b) => a + b, 0)}`;
        modalBody.appendChild(descriptionElement);

        // Создаем радиокнопки для каждого варианта ответа и процент голосов за каждый вариант
        const totalVotes = votingData.votes.reduce((a, b) => a + b, 0);
        const percentageZeroVotes = totalVotes === 0 ? 0 : 100 / totalVotes;

        for (let optionIndex in votingData.option_indices) {
            const option = votingData.option_indices[optionIndex];
            const votes = votingData.votes[optionIndex];
            const percentage = totalVotes === 0 ? percentageZeroVotes : votes / totalVotes * 100;
            const radioInput = createRadioInput(optionIndex, option, votes, percentage);
            modalBody.appendChild(radioInput);
        }

        // Добавляем обработчик события для отправки голоса
        voteButton.onclick = function () {
            const selectedOption = document.querySelector('input[name="options"]:checked');
            if (selectedOption) {
                const optionIndex = selectedOption.value;
                sendVote(index, optionIndex);
            } else {
                alert('Выберите вариант ответа');
            }
        };

        // Открываем модальное окно
        modal.show();
    }

    // Функция для создания радиокнопки для варианта ответа
    function createRadioInput(index, option, votes, percentage) {
        const radioInput = document.createElement('div');
        radioInput.className = 'form-check';
        radioInput.innerHTML = `
            <input class="form-check-input" type="radio" name="options" value="${index}">
            <label class="form-check-label">${option} (${percentage.toFixed(2)}%)</label>
        `;
        return radioInput;
    }

    // Функция для отправки голоса
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
                alert(data.success);
            })
            .catch(error => console.error('Error:', error));
        displayAllVotings();
    }

    // Добавление обработчика события для кнопки "Добавить голосование"
    const addVotingButton = document.getElementById('addVotingButton');
    addVotingButton.addEventListener('click', function () {
        const addVotingModal = new bootstrap.Modal(document.getElementById('addVotingModal'));
        addVotingModal.show();
    });

    // Добавление обработчика события для кнопки "Добавить вариант ответа"
    const addOptionButton = document.getElementById('addOptionButton');
    const addVotingForm = document.getElementById('addVotingForm');

    addOptionButton.addEventListener('click', function () {
        const optionInputs = addVotingForm.querySelectorAll('input[type="text"]');
        const optionIndex = optionInputs.length;

        if (optionIndex > 10) {
            // Проверка на максимальное количество вариантов
            alert('Достигнуто максимальное количество вариантов ответа (10).');
            return;
        }

        const newOptionInput = document.createElement('div');
        newOptionInput.className = 'input-group mb-3';
        newOptionInput.innerHTML = `
        <input type="text" class="form-control" id="option${optionIndex}" placeholder="Вариант ответа ${optionIndex}">
        <button type="button" class="btn btn-danger" style="margin-top:5px" id="removeOptionButton${optionIndex}">Удалить</button>
    `;

        addVotingForm.insertBefore(newOptionInput, addOptionButton);

        // Добавление обработчика события для кнопки "Удалить вариант ответа"
        const removeOptionButton = document.getElementById(`removeOptionButton${optionIndex}`);
        removeOptionButton.addEventListener('click', function () {
            addVotingForm.removeChild(newOptionInput);
            clearVotingForm(); // Обновляем значения темы и описания при удалении
        });
    });

    function clearVotingForm() {
        // Очистка всех полей формы, кроме первых двух
        const form = document.getElementById('addVotingForm');
        const formInputs = form.querySelectorAll('input[type="text"]');
        const topicInput = document.getElementById('votingTopic');
        const descriptionInput = document.getElementById('votingDescription');

        // Очистка полей вариантов ответа
        formInputs.forEach((input, index) => {
            if (index > 0) {
                input.value = '';
            }
        });

        // Очистка полей темы и описания
        topicInput.value = '';
        descriptionInput.value = '';
    }

    // Добавление обработчика события для кнопки "Создать голосование"
    const createVotingButton = document.getElementById('createVotingButton');
    createVotingButton.addEventListener('click', function () {
        const topic = document.getElementById('votingTopic').value;
        const description = document.getElementById('votingDescription').value;

        const options = [];
        for (let i = 1; i <= 10; i++) {
            const optionInput = document.getElementById(`option${i}`);
            if (optionInput) {
                options.push(optionInput.value);
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
                alert(data.success);
                if (data.success) {
                    // Закрываем модальное окно после успешного создания голосования
                    const addVotingModal = new bootstrap.Modal(document.getElementById('addVotingModal'));
                    addVotingModal.hide();
                    // Обновляем список голосований
                    displayAllVotings();
                    clearVotingForm();
                }
            })
            .catch(error => console.error('Error:', error));
    });
});