import styles from '../styles/Auth.module.scss';
import MainContainer from '../components/Containers/MainContainer';
import {Title} from '../components/Titles/Titles';
import {useLoginUser} from '../queries/user';
import {useRegisterUser} from '../queries/user';
import {Link} from 'react-router-dom';
import {queryClient} from '../constants/config';
import Spinner from '../components/Spinner';
import {useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import * as z from 'zod';

const Error = ({error}) => {
	return (
		<span style={{color: 'red', marginBottom: '1rem'}}>
			{error && error}
		</span>
	);
};

const Register = () => {
	const {mutateAsync: loginHandler, isLoading: loggingIn} = useLoginUser();
	const {mutate: registerUser, isLoading: registering} = useRegisterUser();

	const schema = z.object({
		firstName: z
			.string()
			.min(2, {message: 'First name must be at least 2 characters long'})
			.max(20, {
				message: 'First name must be no more than 20 characters long',
			}),
		lastName: z
			.string()
			.min(2, {message: 'Last name must be at least 2 characters long'})
			.max(20, {
				message: 'Last name must be no more than 20 characters long',
			}),
		email: z.string().email({message: 'Email is invalid'}),
		password: z
			.string()
			.min(3, {message: 'Password must be at least 3 characters long'}),
	});

	const {
		register,
		handleSubmit,
		formState: {errors, isValidating: validating},
	} = useForm({
		resolver: zodResolver(schema),
	});

	return (
		<MainContainer>
			{/* REGISTRATION FORM */}
			<form
				action="submit"
				onSubmit={handleSubmit((d) =>
					registerUser(d, {
						onSuccess: async () => {
							await loginHandler({
								email: d.email,
								password: d.password,
							});
							queryClient.invalidateQueries('user');
						},
					})
				)}
				className={styles.registerForm}>
				<div className={styles.container}>
					<Title>Register</Title>
					<span>First Name:</span>
					<input type="fname" {...register('firstName')} />
					<Error error={errors?.firstName?.message} />
					<span>Last Name:</span>
					<input type="lname" {...register('lastName')} />
					<Error error={errors?.lastName?.message} />
					<span>Email:</span>
					<input
						type="email"
						autoComplete="email"
						{...register('email')}
					/>
					<Error error={errors?.email?.message} />
					<span>Password:</span>
					<input type="password" {...register('password')} />
					<Error error={errors?.password?.message} />

					{/* REGISTRATION BTN */}
					<button type="submit">Register Now</button>
				</div>
				<Link to="/auth" style={{textAlign: 'center'}}>
					Already have an account?
				</Link>
			</form>
			{(validating || registering || loggingIn) && <Spinner fullPage />}
		</MainContainer>
	);
};

export default Register;
