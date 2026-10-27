import {isEmailValid} from './email';

describe('arquivo email', ()=>{
    describe('funcao isEmailValid', ()=>{
        test('deve retornar true para o email conhecidamente válido: pedrotonin@fag.edu.br', ()=>{
            const resultado = isEmailValid('pedrotonin@fag.edu.br')
            expect(resultado).toBe(true)
        })
    })
})