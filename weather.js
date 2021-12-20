#!/usr/bin/env node
import { getArgs } from './helpers/args.js'
import {printHelp, printSuccess, printError} from "./services/log.service.js";
import {saveKeyValue, TOKEN_DICT} from "./services/storage.sevice.js";
import {getWeather} from "./services/api.sevice.js";
import chalk from 'chalk'


const saveCity = async (city) => {
    if(!city.length){
        printError('Не передан city')
        return;
    }
    try{
        await saveKeyValue(TOKEN_DICT.city, city)
        printSuccess('city saved')
    } catch (e) {
        printError(e.message)
    }
}

const saveToken = async (token) => {
    if(!token.length){
        printError('Не передан токен')
        return;
    }
    try{
        await saveKeyValue(TOKEN_DICT.token, token)
        printSuccess('Token saved')
    } catch (e) {
        printError(e.message)
    }
}
const getForcast = async () =>{
    try{
        const weather = await getWeather()
        console.log(
            `${chalk.bgBlack("Погода в")} ${weather.name}e составляет ${weather.main.temp} градусов по цельсию
            Ветер: ${weather.wind.speed} М/С`

        ) //вывод погоды
    } catch (e){
        if(e?.response?.status == 404){
            printError('Неверно указан город')
        } else if(e?.response?.status == 401){
            printError('Неверно указан токен')
        } else {
            printError(e.message)
        }
    }


}

const initCLI = () => {
    const args = getArgs(process.argv)
    if (args.h){
        printHelp()
    }
    if (args.s) {
        return saveCity(args.s)
    }
    if (args.t) {
        return saveToken(args.t)
    }
    return getForcast()

}

initCLI();