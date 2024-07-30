import React, { useState } from "react";
import { View, Text, Button, TextInput, StyleSheet, ActivityIndicator, TouchableOpacity } from "react-native";

const CriptMoeda = () => {
  const [moeda, setMoeda] = useState("");
  const [valorDolar, setValorDolar] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [moedaEncontrada, setMoedaEncontrada] = useState("");

  const handleBuscarValor = async () => {
    if (!moeda) {
      setError("Por favor, digite o nome ou símbolo da moeda");
      return;
    }

    setLoading(true);
    setError(null);
    setValorDolar(null);

    try {
      const response = await fetch(`http://192.168.0.77:3000/data`);
      const data = await response.json();

      const criptoMoedas = data;

      const moedaEncontrada = criptoMoedas.find(criptoMoeda => {
        return (
          criptoMoeda.symbol.toLowerCase() === moeda.toLowerCase() ||
          criptoMoeda.name.toLowerCase() === moeda.toLowerCase()
        );
      });

      if (moedaEncontrada) {
        setMoedaEncontrada(moedaEncontrada.name);
        setValorDolar(moedaEncontrada.priceUsd);
      } else {
        setMoedaEncontrada("");
        setValorDolar("Moeda não encontrada");
      }
    } catch (error) {
      console.error("Erro ao obter valor da criptomoeda:", error);
      setError("Erro ao obter valor da criptomoeda");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Digite o nome ou símbolo da moeda"
        value={moeda}
        onChangeText={text => setMoeda(text)}
      />
      <TouchableOpacity style={styles.button} onPress={handleBuscarValor}>
        <Text style={styles.buttonText}>Buscar Valor</Text>
      </TouchableOpacity>
      {loading && <ActivityIndicator style={styles.loader} size="large" color="#0000ff" />}
      {error && <Text style={styles.error}>{error}</Text>}
      <Text style={styles.label}>O valor da moeda {moedaEncontrada ? moedaEncontrada : moeda.toUpperCase()} em dólar é:</Text>
      <Text style={styles.result}>
       {valorDolar !== null ? 
          (typeof valorDolar === "string" ? 
            valorDolar : 
            `${valorDolar}`
          ) :
          "Aguardando valor da moeda..."
        }
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  input: {
    width: "100%",
    marginBottom: 20,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
  },
  result: {
    marginTop: 10,
    fontSize: 18,
  },
  error: {
    marginTop: 20,
    fontSize: 18,
    color: "red",
    textAlign: "center",
  },
  loader: {
    marginTop: 20,
  },
  label: {
    fontSize: 18,
    textAlign: "center",
  },
  button: {
    backgroundColor: "#007bff",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 10,
    marginBottom: 10
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default CriptMoeda;
