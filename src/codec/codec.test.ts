import { decode, encode, encodeHexString, encodeNumber } from '.'

const from = '01'
const to = '02'
const value = '01'
const nonce = 2
const input = '00'
const signature = '01'

test('encode and decode test', () => {
  const encoded = encode([from, to, value, nonce, input, signature])
  expect(encoded.toString('hex')).toBe('010000000101000000020100000001040000000200000001000000000100000001')

  const decoded = decode(encoded)
  expect(decoded[0].toString('hex')).toBe(from)
  expect(decoded[1].toString('hex')).toBe(to)
  expect(decoded[2].toString('hex')).toBe(value)
  expect(decoded[3].readUint32LE()).toBe(nonce)
  expect(decoded[4].toString('hex')).toBe(input)
  expect(decoded[5].toString('hex')).toBe(signature)
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
