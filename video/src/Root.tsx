import { Composition } from "remotion";
import { GeoSenalVideo } from "./GeoSenalVideo";

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="GeoSenal"
      component={GeoSenalVideo}
      durationInFrames={690}
      fps={30}
      width={1920}
      height={1080}
    />
  );
};
