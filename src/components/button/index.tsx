import CircularProgress from '@mui/material/CircularProgress';
import { default as ButtonMui } from '@mui/material/Button';

interface Props {
	label: string,
	onClick?: () => void,
	loading?: boolean,
	fullWidth?: boolean
}

const Button: React.FC<Props> = ({ label, loading, onClick, fullWidth }: Props) => {

	return (<>
		{loading ?
			<CircularProgress /> :
			<ButtonMui fullWidth variant='contained' onClick={onClick}>{label}</ButtonMui>}
	</>);
};
export default Button;
