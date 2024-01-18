$(document).ready(function () {
    $.get('/account/get_user_elections_list', function (data) {
        const electionsList = $('#elections-list');

        if ($.isEmptyObject(data)) {
            electionsList.append('<li class="list-group-item">Пользователь не учавствовал в голосованиях</li>');
        } else {
            $.each(data, function (electionId, electionInfo) {
                electionsList.append(
                    '<li class="list-group-item">' +
                    '<strong>Голосование №' + electionId + '</strong><br>' +
                    'Тема: ' + electionInfo.topic + '<br>' +
                    'Дата начала: ' + electionInfo.date_start + '<br>' +
                    'Дата окончания: ' + electionInfo.date_end + '<br>' +
                    'Создатель: ' + electionInfo.creator + '<br>' +
                    'Выбор: ' + electionInfo.choice +
                    '</li>'
                );
            });
        }
    });
});
