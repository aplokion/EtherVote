const Voting = artifacts.require("Voting");
const BN = require('bn.js');

contract("Voting", (accounts) => {
    it("Создание голосования", async () => {
        const voterAccount = accounts[0];
        const votingInstance = await Voting.deployed();
        const topic = "Тестовое голосование";
        const desciption = "Описание";
        const options = ["Вариант1", "Вариант2"];
        await votingInstance.addElection(topic, desciption, options, { from: voterAccount })
            .then((result) => {
                console.log("Голосование создано (от пользователя 1), получение данных о голосовании...");
            })
            .catch((err) => {
                throw new Error(`Ошибка при создании голосования: ${err}`)
            })
        const electionInfo = await votingInstance.getElectionInfo(0)
            .then((result) => {
                console.log("Данные о голосовании получены, проверка соответствия...");
                return result;
            })
            .catch((err) => {
                throw new Error(`Ошибка при получении данных о голосовании: ${err}`);
            })

        assert.equal(electionInfo[0], topic, "Неправильный заголовок");
        assert.equal(electionInfo[1], desciption, "Неправильное описание");
        assert.deepEqual(electionInfo[2], options, "Неправильные варианты выбора");
    });

    it("Возможность голосования", async () => {
        const votingInstance = await Voting.deployed();
        const voterAccount = accounts[0];
        const electionIndex = 0;
        const optionIndex = 0;

        const electionInfoBefore = await votingInstance.getElectionInfo(0)
            .then((result) => {
                console.log("Данные о голосовании(до голоса) получены, проверка учёта голоса...");
                return result;
            })
            .catch((err) => {
                throw new Error(`Ошибка при получении данных о голосовании: ${err}`);
            });
        const votesBefore = parseInt(electionInfoBefore[3][optionIndex])
    
        await votingInstance.vote(electionIndex, optionIndex, { from: voterAccount })
            .then((result) => {
                console.log("Транзакция голосование пользователя 1 прошла, получение данных о голосовании...");
            })
            .catch((err) => {
                throw new Error(`Ошибка транзакции голосования: ${err}`);
            });

        const electionInfoAfter = await votingInstance.getElectionInfo(electionIndex)
            .then((result) => {
                console.log("Данные о голосовании(после голоса) получены, проверка учёта голоса...");
                return result;
            })
            .catch((err) => {
                throw new Error(`Ошибка при получении данных о голосовании: ${err}`);
            });
        const votesAfter = parseInt(electionInfoAfter[3][optionIndex]);

        assert.equal(votesAfter, votesBefore + 1, "Голос не был учтен");
    });

    it("Получение списка голосований, в которых участвовал пользователь", async () => {
        const votingInstance = await Voting.deployed();
        const voterAccount = accounts[0];
        const voterAccount2 = accounts[1];
        await votingInstance.addElection("Тестовое голосование2", "Описание2", ["Вариант1", "Вариант2"], { from: voterAccount2 })
            .then((result) => {
                console.log("Второе голосование создано (от пользователя 2)");
            })
            .catch((err) => {
                throw new Error(`Ошибка при создании второго голосования: ${err}`,);
            });

        await votingInstance.getParticipatedElections(voterAccount)
            .then((result) => {
                console.log("Список голосований, в которых пользователь 1 принимал участие, получен");
                const resultBN = new BN(result);
                const resultArray = resultBN.toArray();
                assert.deepStrictEqual(resultArray, [0], "Неверный список голосований");
            })
            .catch((err) => {
                throw new Error(`Ошибка при получении списка голосований, в которых участвовал пользователь: ${err}`,);
            });
    });

    it("Получение списка голосований, которые создал пользователь", async () => {
        const votingInstance = await Voting.deployed();
        const voterAccount = accounts[0];
        const voterAccount2 = accounts[1];

        await votingInstance.getCreatedElections(voterAccount)
            .then((result) => {
                console.log("Список голосований, которые создал пользователь 1, получен");
                const resultBN = new BN(result);
                const resultArray = resultBN.toArray();
                assert.deepStrictEqual(resultArray, [0], "Неверный список голосований пользователя 1");
            })
            .catch((err) => {
                throw new Error(`Ошибка при получении списка голосований, которые создал пользователь 1: ${err}`,);
            });

        await votingInstance.getCreatedElections(voterAccount2)
            .then((result) => {
                console.log("Список голосований, которые создал пользователь 2, получен");
                const resultBN = new BN(result);
                const resultArray = resultBN.toArray();
                assert.deepStrictEqual(resultArray, [1], "Неверный список голосований пользователя 2");
            })
            .catch((err) => {
                throw new Error(`Ошибка при получении списка голосований, которые создал пользователь 2: ${err}`,);
            });
    });
});
