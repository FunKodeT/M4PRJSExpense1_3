// STYLES
import styles from '../styles/settingsComponents/Settings.module.scss';
// COMPONENTS
import {Title} from '../components/Titles/Titles';
import MainContainer from '../components/Containers/MainContainer';
// UTILS
import {useUserUpdatePassword} from '../queries/user';
import {useState} from 'react';
import {queryClient} from '../constants/config';

const Settings = () => {
	const {
		mutate: UpdatePassword,
		isError,
		error,
		isLoading,
	} = useUserUpdatePassword();

	// PASSWORD USE STATES
	const [oldPw, setOldPw] = useState('');
	const [newPw, setNewPw] = useState('');

	let body = {
		oldPassword: oldPw,
		password: newPw,
	};

	// HTML
	return (
		<MainContainer>
			<Title>Settings</Title>
			<form action="submit" onSubmit={(e) => e.preventDefault()}>
				<div className={styles.container}>
					<div className={styles.password}>
						<label htmlFor="oldPassword">Current Password:</label>
						<input
							type="password"
							name="oldPassword"
							value={oldPw}
							autoComplete="current-password"
							onChange={(e) => setOldPw(e.target.value)}
						/>
					</div>
					<div className={styles.password}>
						{/* NEW PASSWORD */}
						<label htmlFor="newPassword">New Password:</label>
						<input
							type="password"
							name="newPassword"
							autoComplete="new-password"
							value={newPw}
							onChange={(e) => setNewPw(e.target.value)}
						/>
					</div>
					<button
						onClick={() => {
							UpdatePassword(body, {
								onSuccess: () => {
									queryClient.invalidateQueries('user');
									queryClient.removeQueries();
								},
							});
						}}>
						{isLoading ? 'Loading...' : 'Change Password'}
					</button>
				</div>
			</form>
		</MainContainer>
	);
};

export default Settings;
