
const ErrorsList = ({ errors }) => {
    console.log(errors)
    return <div class="bg-red-50 p-2 mb-4">
        <p class=" py-4 text-red-900 font-semibold text-lg">Ooops...</p>
        <ul class="px-6  list-disc">
            {Array.isArray(errors) && errors.map(error => (
                <li key={error.message} className="text-md text-red-900 text-sm">{error.message}</li>
            ))}
        </ul>
    </div>

}
export default ErrorsList;