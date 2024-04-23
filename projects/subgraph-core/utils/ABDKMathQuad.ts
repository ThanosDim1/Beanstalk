import { BigInt, Bytes } from "@graphprotocol/graph-ts";
import { BigInt_bigEndian } from "./BigEndian";
import { ZERO_BI } from "./Decimals";

export function toUInt(x: BigInt): BigInt {
  // Extract the exponent assuming x is structured similar to a 128-bit float
  let exponent = x.rightShift(112).bitAnd(BigInt.fromUnsignedBytes(Bytes.fromUint8Array(Bytes.fromHexString("0x7FFF").reverse())));

  // log.info("exponent {} {} {}", [exponent.toString(), x.rightShift(112).toString(), BigInt.fromUnsignedBytes(Bytes.fromHexString("0x7FFF")).toString()]);

  // Underflow check
  if (exponent < BigInt.fromString("16383")) {
    return BigInt.fromString("0");
  }

  // Check if the number is negative
  if (x.bitAnd(BigInt_bigEndian("0x80000000000000000000000000000000")) != ZERO_BI) {
    throw new Error("Attempt to convert a negative number to unsigned integer");
  }

  // Overflow check
  if (exponent > BigInt.fromString("16638")) {
    throw new Error("Overflow in conversion");
  }

  // Mask out the significand and set the hidden bit if necessary (this assumes normalized form)
  let result = x.bitAnd(BigInt_bigEndian("0xFFFFFFFFFFFFFFFFFFFFFFFFFFFF")).bitOr(BigInt_bigEndian("0x010000000000000000000000000000"));

  // Adjust result based on exponent
  if (exponent < BigInt.fromString("16495")) {
    result = result.rightShift(<u8>BigInt.fromString("16495").minus(exponent).toU32());
  } else if (exponent > BigInt.fromString("16495")) {
    result = result.leftShift(<u8>exponent.minus(BigInt.fromString("16495")).toU32());
  }

  return result;
}
