import { Account, UnsignedTransaction } from '.'
import { decode } from '../codec'

test('transaction encode test', () => {
  const txJsonStr = "{\"from\": \"7e9cd855ddb203964649da096ebba0515070db91a0bfcba96e4f692ad582f2dc\",\"to\": \"48cddaa3e83ba437487defec48e92f5023cffd67f2c7e506dace3977c662cc56\",\"value\": \"ff\",\"nonce\": 1,\"input\": \"00\"}"
  const tx = UnsignedTransaction.fromJson(txJsonStr)

  expect(tx.toBuffer().toString('hex')).toBe('200000007e9cd855ddb203964649da096ebba0515070db91a0bfcba96e4f692ad582f2dc2000000048cddaa3e83ba437487defec48e92f5023cffd67f2c7e506dace3977c662cc5601000000ff04000000010000000100000000')
})

test('account new test', async () => {
  const publicKey = '9c02a283a8562478ccaf221b9ba2b7cf6348d1dc31a52c0a7af513ed88d62321'
  const account = new Account(publicKey, '00', 10000, '00')
  expect(account.toBuffer().toString('hex')).toBe('200000009c02a283a8562478ccaf221b9ba2b7cf6348d1dc31a52c0a7af513ed88d62321010000000004000000102700000100000000')
})