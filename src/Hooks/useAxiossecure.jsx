import axios from 'axios'
import { useEffect } from 'react'
// import useAuth from './useAuth'
// import { useNavigate } from 'react-router'

const axiosSecure = axios.create({
  // baseURL: 'http://localhost:3000',
  baseURL: 'https://bbgc.academichelperbd.xyz',
})

const useAxiossecure = () => {
//   const { user,Logout} = useAuth()
// const navigate=useNavigate()
//   useEffect(() => {
//     const interceptor = axiosSecure.interceptors.request.use(
//       async (config) => {
//         if (user) {
//           const token = await user.getIdToken()
//           config.headers.authorization = `Bearer ${token}`
//         }
//         return config
//       },
//       (error) => Promise.reject(error)
//     )
//     // response  interseptor
//     const resInterseptor= axiosSecure.interceptors.response.use((response)=>{
//         return response;
//     },
//   (error)=>{
//       console.log(error);
//      const statusCode = error.response?.status

//       if(statusCode===401 || statusCode===403){
//        Logout()
//        .then(()=>{
//           navigate('/login')
//        })
//       }
//       return Promise.reject(error)
      
// })
//     // cleanup interceptor
//     return () => {
//       axiosSecure.interceptors.request.eject(interceptor)
//       axiosSecure.interceptors.response.eject(resInterseptor)
//     }
//   }, [user,Logout,navigate])

  return axiosSecure
}

export default useAxiossecure