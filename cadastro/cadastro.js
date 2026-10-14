(function () {
  var WEBHOOK = 'https://teste.trafegodeloja.com.br/webhook/iuly-cadastro-paciente';
  var form = document.getElementById('cadastro');
  var btn = document.getElementById('enviar');
  var formError = document.getElementById('form-error');
  var cpfInput = document.getElementById('cpf');

  cpfInput.addEventListener('input', function () {
    var d = cpfInput.value.replace(/\D/g, '').slice(0, 11);
    cpfInput.value = d
      .replace(/^(\d{3})(\d)/, '$1.$2')
      .replace(/^(\d{3})\.(\d{3})(\d)/, '$1.$2.$3')
      .replace(/\.(\d{3})(\d)/, '.$1-$2');
  });

  function cpfValido(c) {
    if (c.length !== 11 || /^(\d)\1+$/.test(c)) return false;
    for (var t = 9; t <= 10; t++) {
      var s = 0;
      for (var i = 0; i < t; i++) s += Number(c[i]) * (t + 1 - i);
      if (((s * 10) % 11) % 10 !== Number(c[t])) return false;
    }
    return true;
  }

  function setErr(id, msg) {
    var field = document.getElementById(id);
    document.getElementById('err-' + id).textContent = msg || '';
    if (field.type !== 'checkbox') field.setAttribute('aria-invalid', msg ? 'true' : 'false');
    return !msg;
  }

  function validar() {
    var nome = form.nome.value.trim();
    var cidade = form.cidade.value.trim();
    var nasc = form.nascimento.value;
    var cpf = form.cpf.value.replace(/\D/g, '');
    var hoje = new Date().toISOString().slice(0, 10);
    var ids = ['nome', 'nascimento', 'cidade', 'cpf', 'aceite'];
    var res = [
      setErr('nome', nome.length < 3 ? 'Informe seu nome completo.' : ''),
      setErr('nascimento', !nasc || nasc > hoje || nasc < '1900-01-01' ? 'Informe uma data de nascimento válida.' : ''),
      setErr('cidade', cidade.length < 2 ? 'Informe sua cidade.' : ''),
      setErr('cpf', !cpfValido(cpf) ? 'CPF inválido. Confira os números.' : ''),
      setErr('aceite', !form.aceite.checked ? 'Marque a autorização para continuar.' : '')
    ];
    var primeiro = res.indexOf(false);
    if (primeiro !== -1) document.getElementById(ids[primeiro]).focus();
    return primeiro === -1;
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    formError.hidden = true;
    if (!validar()) return;

    btn.disabled = true;
    btn.textContent = 'Enviando...';

    fetch(WEBHOOK, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nome: form.nome.value.trim(),
        nascimento: form.nascimento.value,
        cidade: form.cidade.value.trim(),
        cpf: form.cpf.value.replace(/\D/g, ''),
        website: form.website.value
      })
    }).then(function (r) {
      if (!r.ok) throw new Error('http ' + r.status);
      document.getElementById('formArea').hidden = true;
      document.getElementById('done').hidden = false;
      window.scrollTo(0, 0);
    }).catch(function () {
      formError.textContent = 'Não foi possível enviar agora. Confira os dados e tente de novo.';
      formError.hidden = false;
      btn.disabled = false;
      btn.textContent = 'Enviar cadastro';
    });
  });
})();
