document.addEventListener('DOMContentLoaded', function () {
    const electionsList = document.getElementById('elections-list');
    const electionsHeading = document.getElementById('elections-heading');
    const participationButton = document.getElementById('participationButton');
    const createdButton = document.getElementById('createdButton');

    participationButton.addEventListener('click', function () {
        fetchElectionsList('/account/get_user_elections_list', 'Голосования, в которых вы участвовали:', participationButton);
    });

    createdButton.addEventListener('click', function () {
        fetchElectionsList('/account/get_user_created_elections_list', 'Созданные вами голосования:', createdButton);
    });

    fetchElectionsList('/account/get_user_elections_list', 'Голосования, в которых вы участвовали:', participationButton);

    function fetchElectionsList(url, headingText, button) {
        const xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    const data = JSON.parse(xhr.responseText);
                    if(button.id === "participationButton"){
                        participationButton.classList.add('btn-selected');
                        createdButton.classList.remove('btn-selected');
                    } else {
                        createdButton.classList.add('btn-selected');
                        participationButton.classList.remove('btn-selected');
                    }
                    if (Object.keys(data).length === 0) {
                        electionsHeading.innerText = 'Нет доступных голосований';
                        electionsList.innerHTML = '<li class="list-group-item">Нет доступных голосований</li>';
                    } else {
                        electionsHeading.innerText = headingText;
                        electionsList.innerHTML = '';
                        Object.entries(data).forEach(([electionId, electionData]) => {
                            const votingElement = createVotingElement(electionData);
                            electionsList.appendChild(votingElement);
                        });
                    }
                } else {
                    console.error('Error:', xhr.status, xhr.statusText);
                }
            }
        };

        xhr.open('GET', url, true);
        xhr.send();
    }

    function createVotingElement(electionData) {
        const votingElement = document.createElement('li');
        votingElement.className = 'list-group-item';
        votingElement.innerHTML = `
            <strong>Тема: ${electionData.topic}</strong><br>
            Описание: ${electionData.description}<br>
            ${createOptionsList(electionData.option_indices, electionData.votes)}`;
        return votingElement;
    }

    function createOptionsList(options, votes) {
        let optionsList = '<ul>';
        for (let i = 0; i < options.length; i++) {
            const percentage = calculatePercentage(votes[i], votes.reduce((a, b) => a + b, 0));
            optionsList += `<li>${options[i]}: ${votes[i]} (${percentage.toFixed(2)}%)</li>`;
        }
        optionsList += '</ul>';
        return optionsList;
    }

    function calculatePercentage(value, total) {
        return total === 0 ? 0 : (value / total) * 100;
    }
});
