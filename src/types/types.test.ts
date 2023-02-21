import { UnsignedTransaction } from "."
import { encode, encodeHexString, encodeNumber } from "../codec"

test('transaction encode test', () => {
  let txJsonStr = "{\"from\": \"7e9cd855ddb203964649da096ebba0515070db91a0bfcba96e4f692ad582f2dc\",\"to\": \"48cddaa3e83ba437487defec48e92f5023cffd67f2c7e506dace3977c662cc56\",\"value\": \"ff\",\"nonce\": 1,\"input\": \"00\"}"
  let tx = UnsignedTransaction.fromJson(txJsonStr)

  expect(tx.toBuffer().toString('hex')).toBe('200000007e9cd855ddb203964649da096ebba0515070db91a0bfcba96e4f692ad582f2dc2000000048cddaa3e83ba437487defec48e92f5023cffd67f2c7e506dace3977c662cc5601000000ff04000000010000000100000000')
})
