import logo from './thumbnail.png';

type LogoType = {
  width?: number;
  height?: number;
};

function LogoIcon({ width = 70, height = 70 }: LogoType) {
  return <img src={logo} alt="РЦК" width={width} height={height} />;
}

export default LogoIcon;
