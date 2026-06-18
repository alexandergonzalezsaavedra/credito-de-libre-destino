export class FinalizeApplicationDto {
  autorizaciones: {
    habeasData: boolean;
    terminosCondiciones: boolean;
    consultaCentrales: boolean;
  };
}
