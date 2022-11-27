import { Component } from 'react';

import {Header} from '../../components/Header';
import {api}from '../../services/api';
import {Food} from '../../components/Food';
import {ModalAddFood} from '../../components/ModalAddFood';
import {ModalEditFood} from '../../components/ModalEditFood';
import { FoodsContainer } from './styles';
import {useState, useEffect} from 'react'


interface IFood {
  id: number;
  name: string;
  price: string;
  description: string;
  available: boolean;
  image: string;
}


export function Dashboard() {


  const [foods, setFoods] = useState<IFood[]>([])
  const [editingFood, setEditingFood] = useState({} as IFood)
  const [modalOpen, setModalOpen] = useState(false) 
  const [editModalOpen, setEditModalOpen] = useState(false)




  const getFoods = async () => {
    const response = await api.get('/foods')

    setFoods(response.data)

  }

  useEffect(() => {
    getFoods()
  }, [])

  const handleAddFood = async (food: IFood) => {

    try {
      const response = await api.post('/foods', {
        ...food,
        available: true,
      });

      setFoods(state => [...state, response.data])
    } catch (err) {
      console.log(err);
      alert(err)
    }
  }

  const handleUpdateFood = async (food: IFood) => {

    try {
      const foodUpdated = await api.put(
        `/foods/${editingFood.id}`,
        { ...editingFood, ...food },
      );

      const foodsUpdated = foods.map(food =>
        food.id !== foodUpdated.data.id ? food : foodUpdated.data,
      );

      setFoods(foodsUpdated)

    } catch (err) {
      console.log(err);
    }
  }

  const handleDeleteFood = async (id: number) => {


    try {
        await api.delete(`/foods/${id}`);

        const foodsFiltered = foods.filter((food) => food.id !== id);

        setFoods(foodsFiltered);
    } catch (err) {

      alert(err)

    }

  }

  const toggleModal = () => {

    setModalOpen(!modalOpen)
  }

  const toggleEditModal = () => {

    setEditModalOpen(!editModalOpen)
  }

  const handleEditFood = (food: IFood) => {
    setEditingFood(food)
    setEditModalOpen(true)
  }


    return (
      <>
        <Header openModal={toggleModal} />
        <ModalAddFood
          isOpen={modalOpen}
          setIsOpen={toggleModal}
          handleAddFood={handleAddFood}
        />
        <ModalEditFood
          isOpen={editModalOpen}
          setIsOpen={toggleEditModal}
          editingFood={editingFood}
          handleUpdateFood={handleUpdateFood}
        />


        <FoodsContainer data-testid="foods-list">
          {foods &&
            foods.map(food => (
              <Food
                key={food.id}
                food={food}
                handleDelete={handleDeleteFood}
                handleEditFood={handleEditFood}
              />
            ))}
        </FoodsContainer>
      </>
    );

};

