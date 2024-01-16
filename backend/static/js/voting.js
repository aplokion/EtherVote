$(document).ready(function () {
    const optionsContainer = $('#options-container');
    const voteButton = $('#vote-button');
    const messageDiv = $('#message');

    $.get('/voting/get_voting_data', function (data) {
        if ($.isEmptyObject(data)) {
            messageDiv.text('Голосование не найдено.');
            voteButton.prop('disabled', true);
        } else {
            $.each(data.options, function (index, option) {
                optionsContainer.append(
                    `<div class="form-check">
                        <input class="form-check-input" type="radio" name="optionRadios" id="option${index}" value="${option}">
                        <label class="form-check-label" for="option${index}">
                            ${option}
                        </label>
                    </div>`
                );
            });

            voteButton.click(function () {
                const selectedOption = $('input[name="optionRadios"]:checked').val();
                if (selectedOption) {
                    submitVote(selectedOption);
                } else {
                    messageDiv.text('Выберите вариант ответа.');
                }
            });
        }
    });

    function submitVote(choice) {
        $.post('/voting/vote', { choice: choice }, function (data) {
            if (data.success) {
                messageDiv.text(`Ваш голос за "${choice}" успешно засчитан.`);
                voteButton.prop('disabled', true);
            } else {
                messageDiv.text(`Ошибка: ${data.error}`);
            }
        });
    }
});
