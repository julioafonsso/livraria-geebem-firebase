import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { Children, ReactElement } from 'react';
import Button from '../button';

interface Props {
	title: string;
	text?: string;
	open: boolean;
	onConfirm: () => void;
	onDecline: () => void;
	onClose: () => void;
	children?: ReactElement;
}

const Confirm: React.FC<Props> = ({
	title,
	text,
	open,
	onConfirm,
	onClose,
	onDecline,
	children,
}: Props) => (
	<Dialog
		open={open}
		onClose={onClose}
		aria-labelledby="alert-dialog-title"
		aria-describedby="alert-dialog-description"
	>
		<DialogTitle id="alert-dialog-title">{title}</DialogTitle>
		<DialogContent>
			<>
				{text && (
					<DialogContentText id="alert-dialog-description">
						{text}
					</DialogContentText>
				)}
				{children}
			</>
		</DialogContent>
		<DialogActions>
			<Button label="Não" onClick={onDecline} />
			<Button label="Sim" onClick={onConfirm} />
		</DialogActions>
	</Dialog>
);

export default Confirm;
