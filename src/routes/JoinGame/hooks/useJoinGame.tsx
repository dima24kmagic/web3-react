import { ChangeEvent } from "react";
import { web3 } from "../../../index";
import { getRPSContractInstance } from "../../../services/contract_rps";
import { useMetaMask } from "metamask-react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../store";
import {
  setJoinRPSAddress,
  setJoinStake,
  setSelectedMove,
} from "../../../store/slices/joinGameSlice";
import { IMove, MOVES } from "../../../components/RPSMoves/PickMove";
import { setStake } from "../../../store/slices/startGameSlice";
import { createJoinedLocalStorageContract } from "../../../services/manageContractsLocalStorage";

const useJoinGame = () => {
  const { account } = useMetaMask();

  const { joinStake, selectedMove, joinRPSAddress } = useSelector(
    (state: RootState) => state.joinGame
  );
  const dispatch = useDispatch();

  const handleJoinRPSAddressChange = (e: ChangeEvent<HTMLInputElement>) => {
    dispatch(setJoinRPSAddress(e.target.value));
  };
  const handleMoveChange = (move: IMove) => {
    dispatch(setSelectedMove(move));
  };

  const handleGetContractInfo = async () => {
    if (!joinRPSAddress) {
      alert("Paste game contract address");
    }

    try {
      const rpsContractInstance = await getRPSContractInstance({
        deployedRPSContractAddress: joinRPSAddress,
      });
      const rpsStake = await rpsContractInstance.methods.stake().call();
      const contractStake = web3.utils.fromWei(rpsStake, "ether");
      dispatch(setJoinStake(contractStake));
    } catch (e) {
      alert("Can't get contract instance");
    }
  };

  const handleAcceptGame = async () => {
    const stakeValue = web3.utils.toWei(joinStake, "ether");

    const rpsContractInstance = await getRPSContractInstance({
      deployedRPSContractAddress: joinRPSAddress,
    });
    try {
      await rpsContractInstance.methods
        .play(selectedMove)
        .send({ from: account, value: stakeValue });
      const creatorAccount = await rpsContractInstance.methods.j1().call();
      dispatch(setJoinStake("0"));
      dispatch(setSelectedMove(MOVES.Rock));
      dispatch(setJoinRPSAddress(""));
      createJoinedLocalStorageContract({
        contractAddress: joinRPSAddress,
        move: selectedMove,
        account: creatorAccount,
      });
    } catch (e) {
      console.log(e);
    }
  };

  const handleDenyGame = () => {
    dispatch(setJoinRPSAddress(""));
    dispatch(setJoinStake("0"));
  };
  return {
    joinRPSAddress,
    selectedMove,
    stake: joinStake,
    handleCreatedGameAddressChange: handleJoinRPSAddressChange,
    handleGetContractInfo,
    handleMoveChange,
    handleAcceptGame,
    handleDenyGame,
  };
};

export default useJoinGame;