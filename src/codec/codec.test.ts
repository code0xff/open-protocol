import { decode, encode } from '.'

const from = '01'
const to = '02'
const value = '01'
const nonce = '02'
const input = '00'
const signature = '01'
const tx = [from, to, value, nonce, input, signature]

test('codec test', () => {
  const rawTx = tx.map(e => Buffer.from(e, 'hex'))
  const encoded = encode(rawTx)
  expect(encoded.toString('hex')).toBe('010000000101000000020100000001010000000201000000000100000001') 

  const decoded = decode(encoded)
  expect(Buffer.concat(decoded).toString('hex')).toBe(Buffer.concat(rawTx).toString('hex'))
})
