const UserRegistry = artifacts.require("UserRegistry");

contract("UserRegistry", (accounts) => {
    it("Регистрация пользователя", async () => {
        const freeToken = accounts[0];
        const userRegistryInstance = await UserRegistry.deployed();
        await userRegistryInstance.registerUser(freeToken, "Логин", "Пароль")
        .then((result) =>{
            console.log("Пользователь зарегистрирован, проверка корректности логина и пароля");
        })
        .catch((err) =>{
            throw new Error(`Ошибка при регистрации: ${err}`);
        })
        const userData = await userRegistryInstance.getUserData(freeToken)
        .then((result)=> {
            console.log("Данные пользователя получены");
            return result;
        })
        .catch((err) => {
            throw new Error(`Ошибка при получени данных пользователя: ${err}`);
        })
        assert.equal(userData[0], "Логин", "Неправильный логин");
        assert.equal(userData[1], "Пароль", "Неправильное пароль");
    });

});
