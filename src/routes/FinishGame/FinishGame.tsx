import React from "react";
import useFinishGame from "./hooks/useFinishGame";
import PickMove from "../../components/RPSMoves";
import { Button, Input, InputLabel, Typography } from "@mui/material";
import styled from "styled-components";

export interface IFinishGameProps {}

const StyledWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin: 0 auto;
`;
/**
 * Finish game
 */
function FinishGame(props: IFinishGameProps) {
  const {} = props;
  const {
    handleChangeFinishRPSAddress,
    handleFinishGame,
    handleSetSelectedMove,
    selectedMove,
    finishRPSAddress,
  } = useFinishGame();

  return (
    <StyledWrapper>
      <Typography
        color="rgba(255,255,255,0.9)"
        textAlign="center"
        marginBottom="24px"
        fontWeight="900"
        fontSize="32px"
      >
        Finish Page
      </Typography>

      <InputLabel htmlFor="finishAddress">Game Address</InputLabel>
      <Input
        type="text"
        id="finishAddress"
        value={finishRPSAddress}
        onChange={handleChangeFinishRPSAddress}
      />
      <PickMove
        onMoveChange={handleSetSelectedMove}
        selectedMove={selectedMove}
      />
      <Button variant="outlined" onClick={handleFinishGame}>
        Finish Game
      </Button>
    </StyledWrapper>
  );
}

export default FinishGame;