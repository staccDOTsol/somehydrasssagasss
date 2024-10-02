"use strict";
/**
 * This code was GENERATED using the solita package.
 * Please DO NOT EDIT THIS FILE, instead rerun solita to update it or write a wrapper to add functionality.
 *
 * See: https://github.com/metaplex-foundation/solita
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createProcessInitFanoutForMintMembershipVoucherInstruction = exports.processInitFanoutForMintMembershipVoucherInstructionDiscriminator = exports.processInitFanoutForMintMembershipVoucherStruct = void 0;
const splToken = __importStar(require("@solana/spl-token"));
const beet = __importStar(require("@metaplex-foundation/beet"));
const web3 = __importStar(require("@solana/web3.js"));
/**
 * @category Instructions
 * @category ProcessInitFanoutForMintMembershipVoucher
 * @category generated
 */
exports.processInitFanoutForMintMembershipVoucherStruct = new beet.BeetArgsStruct([
    ['instructionDiscriminator', beet.uniformFixedSizeArray(beet.u8, 8)],
    ['distributeForMint', beet.bool],
], 'ProcessInitFanoutForMintMembershipVoucherInstructionArgs');
exports.processInitFanoutForMintMembershipVoucherInstructionDiscriminator = [29, 220, 175, 55, 93, 81, 205, 48];
/**
 * Creates a _ProcessInitFanoutForMintMembershipVoucher_ instruction.
 *
 * @param accounts that will be accessed while the instruction is processed
 * @param args to provide as instruction data to the program
 *
 * @category Instructions
 * @category ProcessInitFanoutForMintMembershipVoucher
 * @category generated
 */
function createProcessInitFanoutForMintMembershipVoucherInstruction(accounts, args, programId = new web3.PublicKey('3e8xyB755tq3EAFx6SbgHrRD51ETy4vfvZN8jPbr6pCP')) {
    var _a, _b, _c;
    const [data] = exports.processInitFanoutForMintMembershipVoucherStruct.serialize(Object.assign({ instructionDiscriminator: exports.processInitFanoutForMintMembershipVoucherInstructionDiscriminator }, args));
    const keys = [
        {
            pubkey: accounts.payer,
            isWritable: true,
            isSigner: true,
        },
        {
            pubkey: accounts.authority,
            isWritable: true,
            isSigner: false,
        },
        {
            pubkey: accounts.member,
            isWritable: true,
            isSigner: false,
        },
        {
            pubkey: accounts.membershipMintTokenAccount,
            isWritable: true,
            isSigner: false,
        },
        {
            pubkey: accounts.membershipKey,
            isWritable: false,
            isSigner: false,
        },
        {
            pubkey: accounts.membershipVoucher,
            isWritable: true,
            isSigner: false,
        },
        {
            pubkey: accounts.fanout,
            isWritable: true,
            isSigner: false,
        },
        {
            pubkey: accounts.holdingAccount,
            isWritable: true,
            isSigner: false,
        },
        {
            pubkey: accounts.fanoutForMint,
            isWritable: true,
            isSigner: false,
        },
        {
            pubkey: accounts.fanoutForMintMembershipVoucher,
            isWritable: true,
            isSigner: false,
        },
        {
            pubkey: accounts.fanoutMint,
            isWritable: false,
            isSigner: false,
        },
        {
            pubkey: accounts.fanoutMintMemberTokenAccount,
            isWritable: true,
            isSigner: false,
        },
        {
            pubkey: (_a = accounts.systemProgram) !== null && _a !== void 0 ? _a : web3.SystemProgram.programId,
            isWritable: false,
            isSigner: false,
        },
        {
            pubkey: (_b = accounts.rent) !== null && _b !== void 0 ? _b : web3.SYSVAR_RENT_PUBKEY,
            isWritable: false,
            isSigner: false,
        },
        {
            pubkey: (_c = accounts.tokenProgram) !== null && _c !== void 0 ? _c : splToken.TOKEN_PROGRAM_ID,
            isWritable: false,
            isSigner: false,
        },
        {
            pubkey: accounts.collection,
            isWritable: false,
            isSigner: false,
        },
        {
            pubkey: accounts.metadata,
            isWritable: false,
            isSigner: false,
        },
    ];
    if (accounts.anchorRemainingAccounts != null) {
        for (const acc of accounts.anchorRemainingAccounts) {
            keys.push(acc);
        }
    }
    const ix = new web3.TransactionInstruction({
        programId,
        keys,
        data,
    });
    return ix;
}
exports.createProcessInitFanoutForMintMembershipVoucherInstruction = createProcessInitFanoutForMintMembershipVoucherInstruction;
//# sourceMappingURL=processInitFanoutForMintMembershipVoucher.js.map