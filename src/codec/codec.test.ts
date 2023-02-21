import { decode, encode, encodeHexString, encodeNumber } from '.'

const from = '01'
const to = '02'
const value = '01'
const nonce = '02'
const input = '00'
const signature = '01'
const tx = [from, to, value, nonce, input, signature]

test('encode and decode test', () => {
  const rawTx = tx.map(e => Buffer.from(e, 'hex'))
  const encoded = encode(rawTx)
  expect(encoded.toString('hex')).toBe('010000000101000000020100000001010000000201000000000100000001') 

  const decoded = decode(encoded)
  expect(Buffer.concat(decoded).toString('hex')).toBe(Buffer.concat(rawTx).toString('hex'))
})

test('encodeHexString test', () => {
  const input = '7e9cd855ddb203964649da096ebba0515070db91a0bfcba96e4f692ad582f2dc'
  const buffer = encodeHexString(input)
  expect(buffer.toString('hex')).toBe('7e9cd855ddb203964649da096ebba0515070db91a0bfcba96e4f692ad582f2dc')
})

test('encodeNumber test', () => {
  const input = 1000000000
  const buffer = encodeNumber(input)
  expect(buffer.toString('hex')).toBe('00ca9a3b')
})
