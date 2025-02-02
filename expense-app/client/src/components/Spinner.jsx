import styles from '../styles/Spinner.module.scss';

const Spinner = ({fullPage, background}) => {
	return (
		<div>
			{!fullPage ? (
				<div className={styles.Spinner}></div>
			) : (
				<div
					className={styles.fullPage}
					style={{background: background}}>
					<div className={styles.Spinner}></div>
				</div>
			)}
		</div>
	);
};

Spinner.defaultProps = {
	fullPage: false,
	background: 'rgba(0,0,0,0.5)',
};

export default Spinner;
