import styles from '../../styles/CategoriesComponents/CategoryDelete.module.scss';
import {Title} from '../Titles/Titles';
import {queryClient} from '../../constants/config';
import {useState} from 'react';
import {useCategoriesGet, useCategoryDelete} from '../../queries/category';
import Spinner from '../Spinner';
import {useEffect} from 'react';

// UTILS
const CategoryDelete = () => {
	console.log('CategoryDelete running: Start');
	const {
		data: ctgs,
		isLoading: ctgsLoading,
		isRefetching: ctgsRefetching,
		isSuccess: ctgsSuccess,
	} = useCategoriesGet();
	console.log('CategoryDelete running: useCategoriesGet() success');
	const [category, setCategory] = useState();
	console.log('CategoryDelete running: useState() set');
	const {
		mutate: deleteCategory,
		isLoading: deletingCategory,
		isError,
		isSuccess,
		error,
	} = useCategoryDelete();
	console.log('CategoryDelete running: useCategoryDelete() set');

	// USEEFFECT'S
	useEffect(() => {
		setCategory(ctgs?.data?.ctgs[0]);
	}, [ctgs]);
	console.log('CategoryDelete running: useEffect() set');

	// HTML
	console.log('CategoryDelete running: HTML');

	return (
		<div className={styles.categoryContainer}>
			{/* DELETE CATEGORY */}
			<Title>Delete Category</Title>
			{ctgs?.data?.ctgs?.length > 0 &&
			ctgsSuccess &&
			!ctgsLoading &&
			!ctgsRefetching ? (
				<form onSubmit={(e) => e.preventDefault()}>
					<select
						value={category?.id}
						onChange={(e) =>
							setCategory(
								ctgs?.data?.ctgs.find(
									(ctg) => ctg.id === e.target.value
								)
							)
						}>
						{ctgs?.data?.ctgs?.map((category, index) => {
							return (
								<option key={index} value={category.id}>
									{category.name}
								</option>
							);
						})}
					</select>
					<button
						onClick={() =>
							deleteCategory(category?.id, {
								onSuccess: () => {
									queryClient.invalidateQueries('Categories');
								},
							})
						}>
						Delete Category
					</button>
					{isError && (
						<p style={{color: 'red'}}>
							{JSON.stringify(error?.response?.data?.message)}
						</p>
					)}
					{isSuccess && (
						<p style={{color: 'green'}}>
							{' '}
							Category has been deleted successfully!
						</p>
					)}
				</form>
			) : ctgsLoading || ctgsRefetching ? (
				<span>Loading Categories...</span>
			) : (
				<span>No Categories to Delete</span>
			)}
			{deletingCategory && <Spinner fullPage />}
		</div>
	);
};

export default CategoryDelete;
