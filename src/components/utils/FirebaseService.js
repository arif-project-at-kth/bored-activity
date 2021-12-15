import app from './firebaseConfig.js'
import { getFirestore, getDoc, getDocs, doc, updateDoc, arrayUnion, arrayRemove, collection, addDoc, query, where } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'

const db = getFirestore(app)
const auth = getAuth(app)

const getGameList = async () => {
  try {
    const docs = await getDocs(query(collection(db, 'rooms'), where('status', '!=', 'Done')))
    const activities = []
    docs.forEach((doc) => {
      activities.push({
        content: doc.data(),
        id: doc.id
      })
    })
    return activities
  } catch (error) {
    console.log(error)
  }
}

const getGameRoom = async () => {
  try {
    const querySnapshot = await getDoc(doc(db, 'rooms', 'LpaNnbRc28U9ZX6XQZml'))
    return querySnapshot.data()
  } catch (error) {
    console.error(error)
  }
  return null
}

const joinGame = async (roomId, player) => {
  try {
    await updateDoc(doc(db, 'rooms', roomId), {
      participants: arrayUnion(player)
    })
  } catch (error) {
    console.error(error)
  }
}

const leaveGame = async (roomId, player) => {
  try {
    await updateDoc(doc(db, 'rooms', roomId), {
      participants: arrayRemove(player)
    })
  } catch (error) {
    console.error(error)
  }
}

const endGame = async (roomId, status) => {
  try {
    await updateDoc(doc(db, 'rooms', roomId), {
      status: status
    })
  } catch (error) {
    console.error(error)
  }
}

const completeTask = async (roomId, activities) => {
  try {
    await updateDoc(doc(db, 'rooms', roomId), {
      activities: activities
    })
  } catch (error) {
    console.error(error)
  }
}

const gameRoomToFirebase = async (room) => {
  try {
    const docRef = await addDoc(collection(db, 'rooms'), {
      title: room.title,
      status: room.roomStatus,
      participants: room.participants,
      activities: room.activities,
      owner: room.owner
    })
    console.log('Document written with ID: ', docRef.id)
  } catch (e) {
    console.error('Error adding document: ', e)
  }
}

const currentUser = () => {
  try {
    const user = auth.currentUser
    return user
  } catch (error) {
    console.log(error)
  }
}

export { gameRoomToFirebase, currentUser, getGameRoom, getGameList, joinGame, leaveGame, endGame, completeTask }